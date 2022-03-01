import React, { useEffect, useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { LevelType, Notify } from 'types';
import { Storage } from 'types/storage';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import {
  FormikCheckbox,
  FormikInputDecimalsField,
  FormikInputField,
  FormikSelectField,
  FormikTextAreaField,
} from 'components/Formik';
import { Button } from 'components/UI';
import SymbolChart from 'components/SymbolChart';
import Badge from 'components/Badge';
import Input from 'components/Input';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { OrderDirection } from 'types/trading-engine';
import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';
import SymbolPricesStream, { SymbolPrice } from 'routes/TE/components/SymbolPricesStream';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { calculatePnL, determineOrderType } from 'routes/TE/utils/formulas';
import { useAccountQueryLazyQuery } from './graphql/__generated__/AccountQuery';
import { useAccountSymbolsQueryLazyQuery } from './graphql/__generated__/AccountSymbolsQuery';
import { useCreateOrderMutation } from './graphql/__generated__/CreateOrderMutation';
import './NewOrderModal.scss';

interface FormValues {
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
}

interface Props {
  onSuccess: () => void,
  onCloseModal: () => void,
  storage: Storage,
  notify: Notify,
  login?: string,
}

const NewOrderModal = (props: Props) => {
  const {
    onCloseModal,
    onSuccess,
    storage,
    notify,
    login: propsLogin = '',
  } = props;

  const [login, setLogin] = useState<string>(propsLogin);
  const [currentSymbolPrice, setCurrentSymbolPrice] = useState<SymbolPrice | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [createOrder] = useCreateOrderMutation();
  const [getAccount, accountQuery] = useAccountQueryLazyQuery({ fetchPolicy: 'network-only' });
  const [getAccountSymbols, accountSymbolsQuery] = useAccountSymbolsQueryLazyQuery({ fetchPolicy: 'network-only' });

  const account = accountQuery.data?.tradingEngine.account;
  const allowedSymbols = accountSymbolsQuery.data?.tradingEngine.accountSymbols || [];

  const onChangeSymbol = (value: string, values: FormValues, setValues: Function) => {
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

  const getCurrentSymbol = (symbol: string) => allowedSymbols.find(({ name }) => name === symbol);

  /**
   * Get current BID price with applied group spread
   *
   * @param symbol
   *
   * @return {number}
   */
  const getCurrentPriceBid = (symbol: string) => {
    const currentSymbol = getCurrentSymbol(symbol);

    return round(
      (currentSymbolPrice?.bid || 0) - (currentSymbol?.config?.bidAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  /**
   * Get current ASK price with applied group spread
   *
   * @param symbol
   *
   * @return {number}
   */
  const getCurrentPriceAsk = (symbol: string) => {
    const currentSymbol = getCurrentSymbol(symbol);

    return round(
      (currentSymbolPrice?.ask || 0) + (currentSymbol?.config?.askAdjustment || 0),
      currentSymbol?.digits,
    );
  };

  const handleGetAccount = async () => {
    // Skip requesting account if login is empty or some query already in fly
    if (!login || loading || accountSymbolsQuery.loading) {
      return;
    }

    setLoading(true);

    const { data } = await getAccount({ variables: { identifier: login } });

    setLoading(false);

    if (data?.tradingEngine.account) {
      setFormError('');

      const { uuid } = data?.tradingEngine.account;

      // Load symbols for selected account
      await getAccountSymbols({ variables: { accountUuid: uuid } });
    } else {
      setFormError(I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ERROR'));
    }
  };

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

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.NOTIFICATION.SUCCESS'),
      });

      if (typeof onSuccess === 'function') { onSuccess(); }

      onCloseModal();
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

    const currentPriceBid = getCurrentPriceBid(values.symbol);

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
      const currentPriceBid = getCurrentPriceBid(values.symbol);

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

  const handleSymbolsPricesTick = (_currentSymbolPrice: SymbolPrice) => {
    setCurrentSymbolPrice(_currentSymbolPrice);
  };

  const validate = (values: FormValues) => {
    const currentSymbol = getCurrentSymbol(values.symbol);
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

  useEffect(() => {
    // Load account and his allowed symbols
    if (login) {
      handleGetAccount();
    }
  }, []);

  return (
    <Modal className="NewOrderModal" toggle={onCloseModal} isOpen keyboard={false}>
      {/*
           Disable keyboard controlling on modal to prevent close modal by ESC button because it's working with a bug
           and after close by ESC button hotkeys not working when not clicking ESC button second time.
           So we should implement close event by ESC button manually.
        */}
      <Hotkeys keyName="esc" filter={() => true} onKeyUp={onCloseModal} />

      <Formik
        initialValues={{
          volumeLots: allowedSymbols[0]?.config?.lotMin || 0,
          symbol: allowedSymbols[0]?.name || '',
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
            symbol,
            volumeLots,
            pendingOrder,
          } = values;

          const currentSymbol = getCurrentSymbol(symbol);

          // Get current BID and ASK prices with applied group spread
          const currentPriceBid = getCurrentPriceBid(symbol);
          const currentPriceAsk = getCurrentPriceAsk(symbol);

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
              <If condition={!!symbol}>
                {/* Subscribe to symbol prices stream */}
                <SymbolPricesStream
                  symbol={symbol}
                  onNotify={handleSymbolsPricesTick}
                />
              </If>

              <ModalHeader toggle={onCloseModal}>
                {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.TITLE')}
              </ModalHeader>
              <div className="NewOrderModal__inner-wrapper">
                <SymbolChart symbol={symbol} accountUuid={account?.uuid || ''} />
                <ModalBody>
                  <If condition={!!formError}>
                    <div className="NewOrderModal__error">
                      {formError}
                    </div>
                  </If>
                  <div className="NewOrderModal__field-container">
                    <Input
                      autoFocus
                      name="login"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.LOGIN')}
                      value={login}
                      className="NewOrderModal__field"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                      onEnterPress={handleGetAccount}
                      disabled={!!props.login}
                    />
                    <If condition={!props.login}>
                      <Button
                        className="NewOrderModal__button NewOrderModal__button--small"
                        type="button"
                        primaryOutline
                        submitting={loading}
                        disabled={!login || loading}
                        onClick={handleGetAccount}
                      >
                        {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.UPLOAD')}
                      </Button>
                    </If>
                  </div>
                  <If condition={!!account}>
                    <div className="NewOrderModal__field-container">
                      <div className="NewOrderModal__account">
                        <div>
                          <Badge
                            text={I18n.t(accountTypesLabels[account?.accountType as string].label)}
                            info={account?.accountType === 'DEMO'}
                            success={account?.accountType === 'LIVE'}
                          >
                            <span className="NewOrderModal__account-label">
                              {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.NAME')}:
                            </span>
                            &nbsp;{account?.name}
                          </Badge>
                          <div>
                            <span className="NewOrderModal__account-label">
                              {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.GROUP')}:
                            </span>
                            &nbsp;{account?.group}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span className="NewOrderModal__account-label">
                              {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.BALANCE')}:
                            </span>
                            &nbsp;{I18n.toCurrency(account?.balance || 0, { unit: '' })}
                          </div>
                          <div>
                            <span className="NewOrderModal__account-label">
                              {I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.ACCOUNT.CREDIT')}:
                            </span>
                            &nbsp;{I18n.toCurrency(account?.credit || 0, { unit: '' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </If>
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
                      disabled={!account || accountSymbolsQuery.loading}
                    />
                  </div>
                  <div className="NewOrderModal__field-container">
                    <Field
                      name="symbol"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SYMBOL')}
                      className="NewOrderModal__field"
                      component={FormikSelectField}
                      disabled={!account || accountSymbolsQuery.loading}
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
                      disabled={!account || accountSymbolsQuery.loading}
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
                      disabled={!account || accountSymbolsQuery.loading}
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
                      disabled={autoOpenPrice || !account}
                      component={FormikInputDecimalsField}
                      {...decimalsSettings}
                    />
                    <Button
                      className="NewOrderModal__button NewOrderModal__button--small"
                      type="button"
                      primaryOutline
                      disabled={autoOpenPrice || !account}
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
                        disabled={!account || pendingOrder}
                      />
                      <Field
                        name="pendingOrder"
                        label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.PENDING_ORDER')}
                        component={FormikCheckbox}
                        onChange={handlePendingOrder(values, setValues)}
                        disabled={!account}
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
                  </If>
                  <div className="NewOrderModal__field-container">
                    <Field
                      name="comment"
                      label={I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.COMMENT')}
                      className="NewOrderModal__field"
                      maxLength={1000}
                      component={FormikTextAreaField}
                      disabled={!account}
                    />
                  </div>
                  <div className="NewOrderModal__field-container">
                    <If condition={!!account}>
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
                      disabled={isSellDisabled}
                      onClick={() => {
                        setFieldValue('type', sellType);
                        setFieldValue('direction', OrderDirection.SELL);
                        formikHandleSubmit();
                      }}
                    >
                      {I18n.t(`TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.SELL_${sellType}_AT`, {
                        value: (sellPrice || 0).toFixed(currentSymbol?.digits),
                        type: I18n.t(`TRADING_ENGINE.MODALS.NEW_ORDER_MODAL.${sellType}`),
                      })}
                    </Button>
                    <Button
                      className="NewOrderModal__button"
                      primary
                      disabled={isBuyDisabled}
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
                </ModalBody>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

NewOrderModal.defaultProps = {
  login: '',
};

export default compose(
  React.memo,
  withStorage,
  withNotifications,
)(NewOrderModal);
