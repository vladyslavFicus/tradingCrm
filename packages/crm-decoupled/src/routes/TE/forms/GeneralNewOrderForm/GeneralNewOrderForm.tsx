import React, { useState, useMemo } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { orderBy, intersectionWith } from 'lodash';
import Hotkeys from 'react-hot-keys';
import { Utils, parseErrors, notify, Types, useStorage } from '@crm/common';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import {
  Button,
  Input,
  FormikCheckbox,
  FormikInputDecimalsField,
  FormikInputField,
  FormikSelectTreeField,
} from 'components';
import { OrderDirection } from 'types/trading-engine';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { calculatePnL, calculateMargin, determineOrderType } from 'routes/TE/utils/formulas';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import { useFavoriteSymbolsQuery } from './graphql/__generated__/FavoriteSymbolsQuery';
import { useCreateOrderMutation } from './graphql/__generated__/CreateOrderMutation';
import { useAccountQuery } from './graphql/__generated__/AccountQuery';
import { useAccountSymbolsQuery } from './graphql/__generated__/AccountSymbolsQuery';
import './GeneralNewOrderForm.scss';

type Node = {
  value: string,
  label: string,
  children?: Node[],
  showCheckbox?: boolean,
};

type Props = {
  accountUuid?: string,
  onSymbolChanged?: (symbol: string) => void,
  onSuccess?: () => void,
  hotKeysEnabled?: boolean,
};

type FormValues = {
  volumeLots: number,
  symbol: string,
  openPrice: number | null,
  autoOpenPrice: boolean,
  pendingOrder: boolean,
  direction: string,
  stopLoss: number | null,
  takeProfit: number | null,
  type: string,
  comment: string,
};

const GeneralNewOrderForm = (props: Props) => {
  const {
    accountUuid,
    onSymbolChanged = () => {},
    onSuccess = () => {},
    hotKeysEnabled = true,
  } = props;

  const [symbol, setSymbol] = useState<string>();

  const storage = useStorage();

  const [createOrder] = useCreateOrderMutation();

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
      const sortedAllowedSymbols = orderBy(accountSymbols, ['securityName', 'name'], ['asc', 'asc']);
      const defaultSymbol = accountSymbols.find(_symbol => _symbol.name === 'EURUSD');
      const firstSymbol = sortedAllowedSymbols[0];

      setSymbol(defaultSymbol?.name || firstSymbol?.name);
      onSymbolChanged(defaultSymbol?.name || firstSymbol?.name);
    },
  });

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  const account = accountQuery.data?.tradingEngine.account;
  const allowedSymbols = accountSymbolsQuery.data?.tradingEngine.accountSymbols || [];
  const isAccountArchived = !account?.enable;

  const favoriteSymbolsQuery = useFavoriteSymbolsQuery();
  const favoriteSymbolsData = favoriteSymbolsQuery.data?.tradingEngine.favoriteSymbolData || [];

  const favoriteSymbols = useMemo(() => intersectionWith(
    favoriteSymbolsData,
    allowedSymbols,
    (item, { name }) => item === name,
  ), [allowedSymbols, favoriteSymbolsData]);

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

    return Utils.round(
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

    return Utils.round(
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

    try {
      const { data } = await createOrder({
        variables: {
          ...values,
          accountUuid: account?.uuid as string,
        },
      });

      const orderId = data?.tradingEngine.createOrder.id;

      // Save last created order to storage to open it later by request
      storage.set('TE.lastCreatedOrderId', orderId);

      // Reset form after submission
      formikHelpers.resetForm();
      const defaultSymbol = allowedSymbols.find(_symbol => _symbol.name === 'EURUSD');
      const sortedAllowedSymbols = orderBy(allowedSymbols, ['securityName', 'name'], ['asc', 'asc']);
      const firstSymbol = sortedAllowedSymbols[0];

      setSymbol(defaultSymbol?.name || firstSymbol?.name);

      onSuccess();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const { message } = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message,
      });
    }
  };

  const handleAutoOpenPrice = (values: FormValues, setValues: Function) => () => {
    const autoOpenPrice = !values.autoOpenPrice;

    const currentPriceBid = getCurrentPriceBid();

    // If auto open price is turned on --> remove openPrice, in other case set real BID price to openPrice field
    const openPrice = !autoOpenPrice ? currentPriceBid : undefined;

    setValues({
      ...values,
      autoOpenPrice,
      openPrice,
    });
  };

  const handlePendingOrder = (values: FormValues, setValues: Function) => () => {
    const pendingOrder = !values.pendingOrder;
    let { autoOpenPrice, openPrice } = values;

    // If pending order is turned on --> turn off auto open price and set real BID price to openPrice field
    if (pendingOrder) {
      const currentPriceBid = getCurrentPriceBid();

      autoOpenPrice = false;

      // Set openPrice only if field is empty
      if (!values.openPrice) {
        openPrice = currentPriceBid;
      }
    }

    setValues({
      ...values,
      pendingOrder,
      autoOpenPrice,
      openPrice,
    });
  };

  const onChangeSymbol = (value: string, values: FormValues, setValues: Function) => {
    setSymbol(value);
    onSymbolChanged(value);

    setValues({
      ...values,
      symbol: value,
      takeProfit: null,
      stopLoss: null,
      openPrice: null,
      autoOpenPrice: true,
      pendingOrder: false,
    });
  };

  const validate = (values: FormValues) => {
    const currentSymbol = getCurrentSymbol();
    const { lotMin = 0, lotMax = 1000, lotStep = 1 } = currentSymbol?.config || {};

    return Utils.createValidator({
      volumeLots: [account && 'required', 'numeric', `min:${lotMin}`, `max:${lotMax}`, `step:${lotStep}`],
      symbol: [account && 'required', 'string'],
      ...!values.autoOpenPrice && {
        openPrice: 'required',
      },
      stopLoss: [
        `max:${values.direction === 'BUY'
          && !values.autoOpenPrice
          && values.openPrice
          ? values.openPrice
          : 999999
        }`,
        `min:${values.direction === 'SELL'
          && !values.autoOpenPrice
          && values.openPrice
          ? values.openPrice : 0
        }`,
      ],
      takeProfit: [
        `max:${values.direction === 'SELL'
          && !values.autoOpenPrice
          && values.openPrice
          ? values.openPrice
          : 999999
        }`,
        `min:${values.direction === 'BUY'
          && !values.autoOpenPrice
          && values.openPrice
          ? values.openPrice
          : 0
        }`,
      ],
    }, {
      volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
      openPrice: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE'),
      stopLoss: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS'),
      takeProfit: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TAKE_PROFIT'),
    }, false)(values);
  };

  return (
    <Formik
      initialValues={{
        volumeLots: getCurrentSymbol()?.config?.lotMin || 0,
        symbol: symbol || '',
        openPrice: null,
        stopLoss: null,
        takeProfit: null,
        autoOpenPrice: true,
        pendingOrder: false,
        type: '',
        direction: '',
        comment: '',
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
          autoOpenPrice,
          openPrice,
          volumeLots,
          pendingOrder,
        } = values;

        const currentSymbol = getCurrentSymbol();

        // Get current BID and ASK prices with applied group spread
        const currentPriceBid = getCurrentPriceBid();
        const currentPriceAsk = getCurrentPriceAsk();

        // Get SELL and BUY price depends on autoOpenPrice checkbox
        const sellPrice = autoOpenPrice ? currentPriceBid : openPrice;
        const buyPrice = autoOpenPrice ? currentPriceAsk : openPrice;

        // Determine order type for SELL and BUY buttons for right order creation
        const sellType = determineOrderType({
          pendingOrder,
          openPrice,
          direction: OrderDirection.SELL,
          currentPrice: currentPriceBid,
        });

        const buyType = determineOrderType({
          pendingOrder,
          openPrice,
          direction: OrderDirection.BUY,
          currentPrice: currentPriceAsk,
        });

        // Get status of buttons SELL and BUY
        const isSellDisabled = (
          !account || isSubmitting || !isValid || !sellPrice || (pendingOrder && openPrice === currentPriceBid)
        );
        const isBuyDisabled = (
          !account || isSubmitting || !isValid || !buyPrice || (pendingOrder && openPrice === currentPriceAsk)
        );

        const decimalsSettings = {
          decimalsLimit: currentSymbol?.digits,
          decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
            symbol,
            digits: currentSymbol?.digits,
          }),
          decimalsLengthDefault: currentSymbol?.digits,
        };

        return (
          <Form className="GeneralNewOrderForm">
            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="pendingOrder"
                data-testid="GeneralNewOrderForm-pendingOrderCheckbox"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.PENDING_ORDER')}
                className="GeneralNewOrderForm__pending-order-checkbox"
                component={FormikCheckbox}
                onChange={handlePendingOrder(values, setValues)}
                disabled={!account || isAccountArchived}
              />
            </div>

            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="symbol"
                data-testid="GeneralNewOrderForm-symbolSelectTree"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                className="GeneralNewOrderForm__field"
                favorites={favoriteSymbols}
                component={FormikSelectTreeField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                onChange={(value: string) => onChangeSymbol(value, values, setValues)}
                nodes={allowedSymbolsTree}
              />
            </div>

            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="volumeLots"
                type="number"
                data-testid="GeneralNewOrderForm-volumeLotsInput"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME')}
                className="GeneralNewOrderForm__field"
                placeholder="0.00"
                step={currentSymbol?.config?.lotStep}
                min={currentSymbol?.config?.lotMin}
                max={currentSymbol?.config?.lotMax}
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
              <div className="GeneralNewOrderForm__field">
                {/* Show volume in units only if symbol was loaded and error for volume field is absent */}
                <If condition={!!currentSymbol && !errors.volumeLots}>
                  <div className="GeneralNewOrderForm__units">
                    {I18n.toNumber(values.volumeLots * (currentSymbol?.config?.lotSize || 0), {
                      delimiter: ' ',
                      strip_insignificant_zeros: true,
                    })}&nbsp;
                    {currentSymbol?.baseCurrency || currentSymbol?.name}
                  </div>
                </If>
              </div>
            </div>

            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="stopLoss"
                type="number"
                data-testid="GeneralNewOrderForm-stopLossInputDecimals"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS')}
                className="GeneralNewOrderForm__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                {...decimalsSettings}
              />

              <Field
                name="takeProfit"
                type="number"
                data-testid="GeneralNewOrderForm-takeProfitInputDecimals"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TAKE_PROFIT')}
                className="GeneralNewOrderForm__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                {...decimalsSettings}
              />
            </div>

            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="openPrice"
                type="number"
                data-testid="GeneralNewOrderForm-openPriceInputDecimals"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE')}
                className="GeneralNewOrderForm__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                value={sellPrice}
                disabled={autoOpenPrice || !account || isAccountArchived}
                component={FormikInputDecimalsField}
                {...decimalsSettings}
              />

              <Button
                className="GeneralNewOrderForm__button GeneralNewOrderForm__button--small"
                data-testid="GeneralNewOrderForm-updateButton"
                type="button"
                tertiary
                disabled={autoOpenPrice || !account || isAccountArchived}
                onClick={() => setFieldValue('openPrice', currentPriceBid)}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
              </Button>

              <Field
                name="autoOpenPrice"
                data-testid="GeneralNewOrderForm-autoOpenPriceCheckbox"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                className="GeneralNewOrderForm__auto-checkbox"
                component={FormikCheckbox}
                onChange={handleAutoOpenPrice(values, setValues)}
                disabled={!account || pendingOrder || isAccountArchived}
              />
            </div>

            <If condition={!pendingOrder}>
              <div className="GeneralNewOrderForm__field-container">
                <Input
                  disabled
                  name="sellPnl"
                  data-testid="GeneralNewOrderForm-sellPnlInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_PNL')}
                  value={
                    (account && currentSymbol && currentSymbolPrice)
                      ? calculatePnL({
                        type: OrderType.SELL,
                        currentPriceBid,
                        currentPriceAsk,
                        openPrice: sellPrice,
                        volume: volumeLots,
                        lotSize: currentSymbol?.config?.lotSize,
                        exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                      })
                      : 0}
                  className="GeneralNewOrderForm__field"
                />

                <Input
                  disabled
                  name="buyPnl"
                  data-testid="GeneralNewOrderForm-buyPnlInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_PNL')}
                  value={
                    (account && currentSymbol && currentSymbolPrice)
                      ? calculatePnL({
                        type: OrderType.BUY,
                        currentPriceBid,
                        currentPriceAsk,
                        openPrice: buyPrice,
                        volume: volumeLots,
                        lotSize: currentSymbol?.config?.lotSize,
                        exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
                      })
                      : 0}
                  className="GeneralNewOrderForm__field"
                />
              </div>

              <div className="GeneralNewOrderForm__field-container">
                <Input
                  disabled
                  name="sellMargin"
                  data-testid="GeneralNewOrderForm-sellMarginInput"
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
                  className="GeneralNewOrderForm__field"
                />

                <Input
                  disabled
                  name="buyMargin"
                  data-testid="GeneralNewOrderForm-buyMarginInput"
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
                  className="GeneralNewOrderForm__field"
                />
              </div>
            </If>

            <div className="GeneralNewOrderForm__field-container">
              <Field
                name="comment"
                data-testid="GeneralNewOrderForm-commentInput"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMENT')}
                className="GeneralNewOrderForm__field"
                maxLength={1000}
                component={FormikInputField}
                disabled={!account || isAccountArchived}
              />
            </div>
            <div className="GeneralNewOrderForm__field-container">
              <If condition={!!account && !isAccountArchived && hotKeysEnabled}>
                {/* Sell order by CTRL+S pressing */}
                <Hotkeys
                  keyName="ctrl+s"
                  filter={() => true}
                  onKeyUp={() => {
                    if (!isSellDisabled) {
                      setFieldValue('type', sellType);
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
                      setFieldValue('type', buyType);
                      setFieldValue('direction', OrderDirection.BUY);
                      formikHandleSubmit();
                    }
                  }}
                />
              </If>

              <Button
                className="GeneralNewOrderForm__button"
                data-testid="GeneralNewOrderForm-sellButton"
                danger
                disabled={isSellDisabled || isAccountArchived}
                onClick={() => {
                  setFieldValue('type', sellType);
                  setFieldValue('direction', OrderDirection.SELL);
                  formikHandleSubmit();
                }}
              >
                {I18n.t(`TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_${sellType}_AT`, {
                  value: (sellPrice || 0).toFixed(currentSymbol?.digits),
                  type: I18n.t(`TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.${sellType}`),
                })}
              </Button>

              <Button
                className="GeneralNewOrderForm__button"
                data-testid="GeneralNewOrderForm-buyButton"
                primary
                disabled={isBuyDisabled || isAccountArchived}
                onClick={() => {
                  setFieldValue('type', buyType);
                  setFieldValue('direction', OrderDirection.BUY);
                  formikHandleSubmit();
                }}
              >
                {I18n.t(`TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.BUY_${buyType}_AT`, {
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

GeneralNewOrderForm.defaultProps = {
  accountUuid: null,
  onSymbolChanged: () => {},
  onSuccess: () => {},
  hotKeysEnabled: true,
};

export default React.memo(GeneralNewOrderForm);
