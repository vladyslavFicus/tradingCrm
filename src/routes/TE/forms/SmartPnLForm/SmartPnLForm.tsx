import React, { useMemo, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { orderBy } from 'lodash';
import Hotkeys from 'react-hot-keys';
import compose from 'compose-function';
import moment from 'moment';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import {
  FormikCheckbox,
  FormikInputDecimalsField,
  FormikInputField,
  FormikDatePicker,
  FormikSelectTreeField,
} from 'components/Formik';
import { Button } from 'components/UI';
import Input from 'components/Input';
import { Node } from 'components/SelectTree';
import { Storage } from 'types/storage';
import { OrderDirection, OrderType } from 'types/trading-engine';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { calculateClosePrice, calculateMargin, calculatePnL } from 'routes/TE/utils/formulas';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import { useCreateClosedOrderMutation } from './graphql/__generated__/CreateClosedOrderMutation';
import { useAccountQuery } from './graphql/__generated__/AccountQuery';
import { useAccountSymbolsQuery } from './graphql/__generated__/AccountSymbolsQuery';
import './SmartPnLForm.scss';

type Props = {
  storage: Storage
  notify: Notify
  accountUuid?: string
  onSymbolChanged?: (symbol: string) => void
  onSuccess?: () => void
};

type FormValues = {
  pnl: number | null
  volumeLots: number
  symbol: string
  sellOpenPrice: number
  buyOpenPrice: number
  sellAutoOpenPrice: boolean
  buyAutoOpenPrice: boolean
  direction: OrderDirection
  commission: number
  swaps: number
  openTime: string | null
};

const SmartPnLForm = (props: Props) => {
  const {
    storage,
    notify,
    accountUuid,
    onSymbolChanged = () => {},
    onSuccess = () => {},
  } = props;

  const [symbol, setSymbol] = useState<string>();

  const [createClosedOrder] = useCreateClosedOrderMutation();

  const accountQuery = useAccountQuery({
    variables: { identifier: accountUuid as string },
    skip: !accountUuid,
  });

  const accountSymbolsQuery = useAccountSymbolsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      accountUuid: accountUuid as string,
    },
    skip: !accountUuid,
    onCompleted({ tradingEngine: { accountSymbols } }) {
      const defaultSymbol = accountSymbols.find(_symbol => _symbol.name === 'EURUSD');
      const sortedAllowedSymbols = orderBy(accountSymbols, ['securityName', 'name'], ['asc', 'asc']);
      const firstSymbol = sortedAllowedSymbols[0];

      setSymbol(defaultSymbol?.name || firstSymbol?.name);
      onSymbolChanged(defaultSymbol?.name || firstSymbol?.name);
    },
  });

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  const account = accountQuery.data?.tradingEngine.account;
  const allowedSymbols = accountSymbolsQuery.data?.tradingEngine.accountSymbols || [];
  const isAccountArchived = !account?.enable;

  const exchangeRate = currentSymbolPrice?.pnlRates[account?.currency as string] || 0;

  // Symbol tree to render inside SelectTree component
  const allowedSymbolsTree = useMemo(
    () => {
      const sortedAllowedSymbols = orderBy(allowedSymbols, ['securityName', 'name'], ['asc', 'asc']);

      const result: { [key: string]: Node } = {};

      sortedAllowedSymbols.forEach(({ name, description, securityName }) => {
        if (!result[securityName]) {
          result[securityName] = {
            label: securityName,
            value: securityName,
            children: [],
          };
        }

        result[securityName].children?.push({
          label: `${name} ${description}`,
          value: name,
        });
      });

      return Object.values(result);
    },
    [allowedSymbols],
  );

  // ===== Getters ===== ///
  /**
   * Get current symbol from allowedSymbols
   */
  const getCurrentSymbol = () => allowedSymbols.find(({ name }) => name === symbol);

  /**
   * Get current BID price with applied group spread
   *
   * @return {number}
   */
  const getCurrentPriceBid = () => {
    const currentSymbol = getCurrentSymbol();

    return round(
      (currentSymbolPrice?.bid || 0) - (currentSymbol?.config?.bidAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  /**
   * Get current ASK price with applied group spread
   *
   * @return {number}
   */
  const getCurrentPriceAsk = () => {
    const currentSymbol = getCurrentSymbol();

    return round(
      (currentSymbolPrice?.ask || 0) + (currentSymbol?.config?.askAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // Should be manual error validation here, cause setFieldValue and handleSubmit after that not firing validate form
    const errors = await formikHelpers.validateForm(values);

    // Disable submitting form if errors occurred
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Get current symbol
    const currentSymbol = getCurrentSymbol();

    // Get current BID and ASK prices with applied group spread
    const currentPriceBid = getCurrentPriceBid();
    const currentPriceAsk = getCurrentPriceAsk();

    let openPrice = 0;

    // Get openPrice for SELL order
    if (values.direction === OrderDirection.SELL) {
      openPrice = values.sellAutoOpenPrice ? currentPriceBid : values.sellOpenPrice;
    }

    // Get openPrice for BUY order
    if (values.direction === OrderDirection.BUY) {
      openPrice = values.buyAutoOpenPrice ? currentPriceAsk : values.buyOpenPrice;
    }

    // Calculate close price on provided data
    const closePrice = calculateClosePrice({
      direction: values.direction,
      pnl: values.pnl,
      openPrice,
      volume: values.volumeLots,
      lotSize: currentSymbol?.config?.lotSize,
      digits: currentSymbol?.digits,
      exchangeRate,
    });

    try {
      const { data } = await createClosedOrder({
        variables: {
          accountUuid: account?.uuid as string,
          direction: values.direction,
          symbol: values.symbol,
          volumeLots: values.volumeLots,
          openPrice,
          closePrice,
          exchangeRate,
          openTime: values.openTime,
          commission: values.commission,
          swaps: values.swaps,
        },
      });

      const orderId = data?.tradingEngine.createClosedOrder.id;

      // Save last created order to storage to open it later by request
      storage.set('TE.lastCreatedOrderId', orderId);

      onSuccess();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const { message } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message,
      });
    }
  };

  const handleSellAutoOpenPrice = (values: FormValues, setValues: Function) => () => {
    const sellAutoOpenPrice = !values.sellAutoOpenPrice;

    const currentPriceBid = getCurrentPriceBid();

    // If auto open price is turned on --> remove openPrice, in other case set real BID price to openPrice field
    const sellOpenPrice = !sellAutoOpenPrice ? currentPriceBid : undefined;

    setValues({
      ...values,
      sellAutoOpenPrice,
      sellOpenPrice,
    });
  };

  const handleBuyAutoOpenPrice = (values: FormValues, setValues: Function) => () => {
    const buyAutoOpenPrice = !values.buyAutoOpenPrice;

    const currentPriceAsk = getCurrentPriceAsk();

    // If auto open price is turned on --> remove openPrice, in other case set real ASK price to openPrice field
    const buyOpenPrice = !buyAutoOpenPrice ? currentPriceAsk : undefined;

    setValues({
      ...values,
      buyAutoOpenPrice,
      buyOpenPrice,
    });
  };

  const onChangeSymbol = (value: string, values: FormValues, setValues: Function) => {
    setSymbol(value);
    onSymbolChanged(value);

    setValues({
      ...values,
      symbol: value,
      sellOpenPrice: null,
      buyOpenPrice: null,
      sellAutoOpenPrice: true,
      buyAutoOpenPrice: true,
    });
  };

  const validate = (values: FormValues) => {
    const currentSymbol = getCurrentSymbol();
    const { lotMin = 0, lotMax = 1000, lotStep = 1 } = currentSymbol?.config || {};

    return createValidator({
      pnl: ['required', 'numeric'],
      volumeLots: ['required', 'numeric', `min:${lotMin}`, `max:${lotMax}`, `step:${lotStep}`],
      openTime: ['dateWithTime', `validDateTimeRange:${moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]')}`],
      symbol: ['required', 'string'],
      ...!values.sellAutoOpenPrice && {
        sellOpenPrice: ['required', 'min:0'],
      },
      ...!values.buyAutoOpenPrice && {
        buyOpenPrice: ['required', 'min:0'],
      },
      commission: ['required', 'numeric'],
      swaps: ['required', 'numeric'],
    }, {
      pnl: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.EXPECTED_PNL'),
      volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
      sellOpenPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE_SELL'),
      buyOpenPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE_BUY'),
      commission: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMISSION'),
      swaps: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SWAPS'),
    },
    false,
    {
      'validDateTimeRange.openTime': I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_TIME_ERROR'),
    })(values);
  };

  return (
    <Formik
      initialValues={{
        pnl: 1,
        volumeLots: getCurrentSymbol()?.config?.lotMin || 0,
        openTime: null,
        symbol: symbol || '',
        sellOpenPrice: 0,
        buyOpenPrice: 0,
        sellAutoOpenPrice: true,
        buyAutoOpenPrice: true,
        direction: OrderDirection.SELL,
        commission: 0,
        swaps: 0,
      } as FormValues}
      validate={validate}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        isValid,
        values,
        errors,
        setFieldValue,
        setValues,
        handleSubmit: formikHandleSubmit,
      }) => {
        const {
          sellAutoOpenPrice,
          sellOpenPrice,
          buyAutoOpenPrice,
          buyOpenPrice,
          volumeLots,
          pnl,
        } = values;

        const currentSymbol = getCurrentSymbol();

        // Get current BID and ASK prices with applied group spread
        const currentPriceBid = getCurrentPriceBid();
        const currentPriceAsk = getCurrentPriceAsk();

        // Get SELL and BUY open prices depends on autoOpenPrice checkbox
        const sellPrice = sellAutoOpenPrice ? currentPriceBid : sellOpenPrice;
        const buyPrice = buyAutoOpenPrice ? currentPriceAsk : buyOpenPrice;

        // Get SELL and BUY close prices
        const sellClosePrice = calculateClosePrice({
          direction: OrderDirection.SELL,
          pnl,
          openPrice: sellPrice,
          volume: volumeLots,
          lotSize: currentSymbol?.config?.lotSize,
          digits: currentSymbol?.digits,
          exchangeRate,
        });

        const buyClosePrice = calculateClosePrice({
          direction: OrderDirection.BUY,
          pnl,
          openPrice: buyPrice,
          volume: volumeLots,
          lotSize: currentSymbol?.config?.lotSize,
          digits: currentSymbol?.digits,
          exchangeRate,
        });

        // Calculate real received P/L for SELL and BUY orders
        const sellPnl = calculatePnL({
          type: OrderType.SELL,
          openPrice: sellPrice,
          currentPriceAsk: sellClosePrice,
          currentPriceBid: buyClosePrice,
          volume: volumeLots,
          lotSize: currentSymbol?.config?.lotSize,
          exchangeRate,
        });

        const buyPnl = calculatePnL({
          type: OrderType.BUY,
          openPrice: buyPrice,
          currentPriceAsk: sellClosePrice,
          currentPriceBid: buyClosePrice,
          volume: volumeLots,
          lotSize: currentSymbol?.config?.lotSize,
          exchangeRate,
        });

        // Get status of buttons SELL and BUY
        const isSellDisabled = !account || isSubmitting || !isValid || !sellPrice || sellClosePrice < 0;
        const isBuyDisabled = !account || isSubmitting || !isValid || !buyPrice || buyClosePrice < 0;

        const decimalsSettings = {
          decimalsLimit: currentSymbol?.digits,
          decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
            symbol,
            digits: currentSymbol?.digits,
          }),
          decimalsLengthDefault: currentSymbol?.digits,
        };

        return (
          <Form>
            <div className="SmartPnLForm__field-container">
              <Field
                name="symbol"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                className="SmartPnLForm__field"
                component={FormikSelectTreeField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                onChange={(value: string) => onChangeSymbol(value, values, setValues)}
                nodes={allowedSymbolsTree}
              />
            </div>
            <div className="SmartPnLForm__field-container">
              <Field
                name="volumeLots"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME')}
                className="SmartPnLForm__field"
                placeholder="0.00"
                step={currentSymbol?.config?.lotStep}
                min={currentSymbol?.config?.lotMin}
                max={currentSymbol?.config?.lotMax}
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
              <Field
                name="openTime"
                className="SmartPnLForm__field"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_TIME')}
                component={FormikDatePicker}
                maxDate={moment()}
                withTime
                withUtc
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
            </div>

            <div className="SmartPnLForm__field-container SmartPnLForm__field-container--column">
              <Field
                name="pnl"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.EXPECTED_PNL')}
                className="SmartPnLForm__field"
                placeholder="0.00"
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
              <If condition={
                !Object.keys(errors).length
                && !!account
                && !accountSymbolsQuery.loading
                && !isAccountArchived
                && !!currentSymbolPrice
              }
              >
                <div className="SmartPnLForm__field-hint">
                  {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.REAL_RECEIVED_PNL')}:
                  SELL = <strong>{sellPnl}</strong>, BUY = <strong>{buyPnl}</strong>
                </div>
              </If>
            </div>

            {/* SELL information row */}
            <div className="SmartPnLForm__field-container">
              <Field
                name="sellOpenPrice"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE_SELL')}
                className="SmartPnLForm__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                value={sellPrice}
                disabled={sellAutoOpenPrice || !account || isAccountArchived}
                component={FormikInputDecimalsField}
                {...decimalsSettings}
              />
              <Button
                data-testid="sellPriceUpdate"
                className="SmartPnLForm__button SmartPnLForm__button--small"
                type="button"
                primaryOutline
                disabled={sellAutoOpenPrice || !account || isAccountArchived}
                onClick={() => setFieldValue('sellOpenPrice', currentPriceBid)}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
              </Button>
              <div className="SmartPnLForm__checkbox-container">
                <Field
                  data-testid="sellAutoOpenPrice"
                  name="sellAutoOpenPrice"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                  className="SmartPnLForm__auto-checkbox"
                  component={FormikCheckbox}
                  onChange={handleSellAutoOpenPrice(values, setValues)}
                  disabled={!account || isAccountArchived}
                />
              </div>
              <Input
                disabled
                type="number"
                name="sellClosePrice"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.CLOSE_PRICE_SELL')}
                value={sellClosePrice}
                className="SmartPnLForm__field"
                error={sellClosePrice < 0
                  && I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.CLOSE_PRICE_NEGATIVE_ERROR')
                }
              />
            </div>

            {/* BUY information row */}
            <div className="SmartPnLForm__field-container">
              <Field
                name="buyOpenPrice"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE_BUY')}
                className="SmartPnLForm__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                value={buyPrice}
                disabled={buyAutoOpenPrice || !account || isAccountArchived}
                component={FormikInputDecimalsField}
                {...decimalsSettings}
              />
              <Button
                data-testid="buyPriceUpdate"
                className="SmartPnLForm__button SmartPnLForm__button--small"
                type="button"
                primaryOutline
                disabled={buyAutoOpenPrice || !account || isAccountArchived}
                onClick={() => setFieldValue('buyOpenPrice', currentPriceAsk)}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
              </Button>
              <div className="SmartPnLForm__checkbox-container SmartPnLForm__checkbox-container--smart-pnl">
                <Field
                  data-testid="buyAutoOpenPrice"
                  name="buyAutoOpenPrice"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                  className="SmartPnLForm__auto-checkbox"
                  component={FormikCheckbox}
                  onChange={handleBuyAutoOpenPrice(values, setValues)}
                  disabled={!account || isAccountArchived}
                />
              </div>
              <Input
                disabled
                type="number"
                name="buyClosePrice"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.CLOSE_PRICE_BUY')}
                value={buyClosePrice}
                className="SmartPnLForm__field"
                error={buyClosePrice < 0
                  && I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.CLOSE_PRICE_NEGATIVE_ERROR')
                }
              />
            </div>
            <div className="SmartPnLForm__field-container">
              <Field
                name="commission"
                type="number"
                step="0.00001"
                placeholder="0.00"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMISSION')}
                className="SmartPnLForm__field"
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
              <Field
                name="swaps"
                type="number"
                step="0.00001"
                placeholder="0.00"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SWAPS')}
                className="SmartPnLForm__field"
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
            </div>
            <div className="SmartPnLForm__field-container">
              <Input
                disabled
                name="sellMargin"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_MARGIN')}
                value={
                  (account && currentSymbol && currentSymbolPrice)
                    ? calculateMargin({
                      symbolType: currentSymbol.symbolType,
                      openPrice: sellPrice,
                      volume: volumeLots,
                      lotSize: currentSymbol.config?.lotSize,
                      leverage: account.leverage,
                      marginRate: currentSymbolPrice.marginRates[account.currency],
                      percentage: currentSymbol.config?.percentage,
                    })
                    : 0}
                className="SmartPnLForm__field"
              />
              <Input
                disabled
                name="buyMargin"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_MARGIN')}
                value={
                  (account && currentSymbol && currentSymbolPrice)
                    ? calculateMargin({
                      symbolType: currentSymbol.symbolType,
                      openPrice: buyPrice,
                      volume: volumeLots,
                      lotSize: currentSymbol.config?.lotSize,
                      leverage: account.leverage,
                      marginRate: currentSymbolPrice.marginRates[account.currency],
                      percentage: currentSymbol.config?.percentage,
                    })
                    : 0}
                className="SmartPnLForm__field"
              />
            </div>
            <div className="SmartPnLForm__field-container">
              <If condition={!!account && !isAccountArchived}>
                {/* Sell order by CTRL+S pressing */}
                <Hotkeys
                  keyName="ctrl+s"
                  filter={() => true}
                  onKeyUp={() => {
                    if (!isSellDisabled) {
                      setFieldValue('direction', OrderDirection.SELL);
                      formikHandleSubmit();
                    }
                  }}
                />

                {/* Buy order by CTRL+D pressing */}
                <Hotkeys
                  keyName="ctrl+d"
                  filter={() => true}
                  onKeyUp={() => {
                    if (!isBuyDisabled) {
                      setFieldValue('direction', OrderDirection.BUY);
                      formikHandleSubmit();
                    }
                  }}
                />
              </If>
              <Button
                className="SmartPnLForm__button"
                danger
                disabled={isSellDisabled || isAccountArchived}
                onClick={() => {
                  setFieldValue('direction', OrderDirection.SELL);
                  formikHandleSubmit();
                }}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_MARKET_AT', {
                  value: (sellPrice || 0).toFixed(currentSymbol?.digits),
                  type: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.MARKET'),
                })}
              </Button>
              <Button
                className="SmartPnLForm__button"
                primary
                disabled={isBuyDisabled || isAccountArchived}
                onClick={() => {
                  setFieldValue('direction', OrderDirection.BUY);
                  formikHandleSubmit();
                }}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_MARKET_AT', {
                  value: (buyPrice || 0).toFixed(currentSymbol?.digits),
                })}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

SmartPnLForm.defaultProps = {
  accountUuid: null,
  onSymbolChanged: () => {},
  onSuccess: () => {},
};

export default compose(
  React.memo,
  withNotifications,
  withStorage,
)(SmartPnLForm);
