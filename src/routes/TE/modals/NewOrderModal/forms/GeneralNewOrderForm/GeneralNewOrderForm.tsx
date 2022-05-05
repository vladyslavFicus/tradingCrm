import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import {
  FormikCheckbox,
  FormikInputDecimalsField,
  FormikInputField,
  FormikSelectField,
  FormikTextAreaField,
} from 'components/Formik';
import { Button } from 'components/UI';
import Input from 'components/Input';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import { OrderDirection } from 'types/trading-engine';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { calculatePnL, calculateMargin, determineOrderType } from 'routes/TE/utils/formulas';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import { Account } from '../../NewOrderModal';
import { useCreateOrderMutation } from './graphql/__generated__/CreateOrderMutation';
import { useAccountSymbolsQuery } from './graphql/__generated__/AccountSymbolsQuery';

type Props = {
  notify: Notify
  account?: Account
  symbol?: string,
  onSymbolChanged: (symbol: string) => void
  onSuccess: (orderId: number) => void
};

type FormValues = {
  volumeLots: number
  symbol: string
  openPrice: number | null
  autoOpenPrice: boolean
  pendingOrder: boolean
  direction: string
  stopLoss: number | null
  takeProfit: number | null
  type: string
  comment: string
};

const GeneralNewOrderForm = (props: Props) => {
  const {
    notify,
    account,
    symbol,
    onSymbolChanged,
    onSuccess,
  } = props;

  const [createOrder] = useCreateOrderMutation();

  const accountSymbolsQuery = useAccountSymbolsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      accountUuid: account?.uuid as string,
    },
    skip: !account,
    onCompleted({ tradingEngine: { accountSymbols } }) {
      onSymbolChanged(accountSymbols[0]?.name);
    },
  });

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  const allowedSymbols = accountSymbolsQuery.data?.tradingEngine.accountSymbols || [];
  const isAccountArchived = !account?.enable;

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

    try {
      const { data } = await createOrder({
        variables: {
          ...values,
          accountUuid: account?.uuid as string,
        },
      });

      const orderId = data?.tradingEngine.createOrder.id;

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess(orderId as number);
    } catch (e) {
      const { message } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
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

    return createValidator({
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
          <Form>
            <div className="NewOrderModal__field-container">
              <Field
                name="volumeLots"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME')}
                className="NewOrderModal__field"
                placeholder="0.00"
                step={currentSymbol?.config?.lotStep}
                min={currentSymbol?.config?.lotMin}
                max={currentSymbol?.config?.lotMax}
                component={FormikInputField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
              />
            </div>
            <div className="NewOrderModal__field-container">
              <Field
                name="symbol"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                className="NewOrderModal__field"
                component={FormikSelectField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                customOnChange={(value: string) => onChangeSymbol(value, values, setValues)}
                searchable
              >
                {allowedSymbols.map(({ name, description }) => (
                  <option key={name} value={name}>
                    {`${name}  ${description}`}
                  </option>
                ))}
              </Field>
            </div>
            <div className="NewOrderModal__field-container">
              <Field
                name="takeProfit"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TAKE_PROFIT')}
                className="NewOrderModal__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                {...decimalsSettings}
              />
              <Field
                name="stopLoss"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.STOP_LOSS')}
                className="NewOrderModal__field"
                placeholder={placeholder(currentSymbol?.digits || 0)}
                step={step(currentSymbol?.digits || 0)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                disabled={!account || accountSymbolsQuery.loading || isAccountArchived}
                {...decimalsSettings}
              />
            </div>
            <div className="NewOrderModal__field-container">
              <Field
                name="openPrice"
                type="number"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.OPEN_PRICE')}
                className="NewOrderModal__field"
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
                className="NewOrderModal__button NewOrderModal__button--small"
                type="button"
                primaryOutline
                disabled={autoOpenPrice || !account || isAccountArchived}
                onClick={() => setFieldValue('openPrice', currentPriceBid)}
              >
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPDATE')}
              </Button>
              <div className="NewOrderModal__checkbox-container">
                <Field
                  name="autoOpenPrice"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.AUTO')}
                  className="NewOrderModal__auto-checkbox"
                  component={FormikCheckbox}
                  onChange={handleAutoOpenPrice(values, setValues)}
                  disabled={!account || pendingOrder || isAccountArchived}
                />
                <Field
                  name="pendingOrder"
                  label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.PENDING_ORDER')}
                  component={FormikCheckbox}
                  onChange={handlePendingOrder(values, setValues)}
                  disabled={!account || isAccountArchived}
                />
              </div>
            </div>
            <If condition={!pendingOrder}>
              <div className="NewOrderModal__field-container">
                <Input
                  disabled
                  name="sellPnl"
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
                  className="NewOrderModal__field"
                />
                <Input
                  disabled
                  name="buyPnl"
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
                  className="NewOrderModal__field"
                />
              </div>
              <div className="NewOrderModal__field-container">
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
                  className="NewOrderModal__field"
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
                  className="NewOrderModal__field"
                />
              </div>
            </If>
            <div className="NewOrderModal__field-container">
              <Field
                name="comment"
                label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMENT')}
                className="NewOrderModal__field"
                maxLength={1000}
                component={FormikTextAreaField}
                disabled={!account || isAccountArchived}
              />
            </div>
            <div className="NewOrderModal__field-container">
              <If condition={!!account && !isAccountArchived}>
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
                className="NewOrderModal__button"
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
                className="NewOrderModal__button"
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
  account: null,
  symbol: null,
};

export default compose(
  React.memo,
  withNotifications,
)(GeneralNewOrderForm);
