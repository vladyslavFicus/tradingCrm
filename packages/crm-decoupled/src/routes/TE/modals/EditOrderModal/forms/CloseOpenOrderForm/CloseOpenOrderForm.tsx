import React, { useRef } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormikInputDecimalsField, FormikInputField } from 'components/Formik';
import { Button } from 'components';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { OrderDirection } from 'types/trading-engine';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import PnL from 'routes/TE/components/PnL';
import { useSymbolPricesStream, SymbolPrice } from 'routes/TE/components/SymbolPricesStream';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useCloseOrderMutation } from './graphql/__generated__/CloseOrderMutation';

type Props = {
  order: OrderQuery['tradingEngine']['order'],
  onSuccess: (shouldCloseModal?: boolean) => void,
};

type FormValues = {
  volumeLots: number,
  closePrice: number,
};

const CloseOpenOrderForm = (props: Props) => {
  const { order, onSuccess } = props;

  const {
    id,
    type,
    status,
    symbol,
    digits,
    volumeLots,
    openPrice,
    direction,
    symbolConfig,
  } = order;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const [closeOrder] = useCloseOrderMutation();

  const initialSymbolPrice = useRef<SymbolPrice | null>(null);

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  // Save first price tick when it was initiated
  if (!initialSymbolPrice.current) {
    initialSymbolPrice.current = currentSymbolPrice;
  }

  // Get current BID and ASK prices with applied group spread
  const currentPriceBid = round((currentSymbolPrice?.bid || 0) - (symbolConfig?.bidAdjustment || 0), digits);
  const currentPriceAsk = round((currentSymbolPrice?.ask || 0) + (symbolConfig?.askAdjustment || 0), digits);

  // Get initial BID and ASK prices with applied group spread
  const initialPriceBid = round((initialSymbolPrice.current?.bid || 0) - (symbolConfig?.bidAdjustment || 0), digits);
  const initialPriceAsk = round((initialSymbolPrice.current?.ask || 0) + (symbolConfig?.askAdjustment || 0), digits);

  // ==== Settings ==== //
  const decimalsSettings = {
    decimalsLimit: digits,
    decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
      symbol,
      digits,
    }),
    decimalsLengthDefault: digits,
  };

  // ==== Handlers ==== //
  const handleCloseOrder = async (values: FormValues) => {
    confirmActionModal.show({
      modalTitle: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TITLE_${status}`),
      actionText: I18n.t(`TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CLOSE_ORDER_TEXT_${status}`, {
        id,
        symbol,
        closePrice: values.closePrice.toFixed(digits),
        type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
      }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await closeOrder({
            variables: {
              orderId: id,
              volume: values.volumeLots,
              closePrice: values.closePrice,
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CLOSE_SUCCESS'),
          });

          onSuccess(true);
        } catch (_) {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.CLOSE_FAILED'),
          });
        }
      },
    });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        volumeLots,
        closePrice: direction === OrderDirection.SELL ? initialPriceAsk : initialPriceBid,
      }}
      validate={createValidator({
        volumeLots: [
          'required',
          'numeric',
          `min:${symbolConfig?.lotStep}`,
          `max:${volumeLots}`,
          `step:${symbolConfig?.lotStep}`,
        ],
      }, {
        volumeLots: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
      }, false)}
      onSubmit={handleCloseOrder}
    >
      {({ values: _values, setFieldValue, isValid }) => (
        <Form>
          <fieldset className="EditOrderModal__fieldset">
            <legend className="EditOrderModal__fieldset-title">
              {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PROCESS')}
            </legend>

            <div className="EditOrderModal__field-container">
              <Field
                name="volumeLots"
                type="number"
                placeholder="0.00"
                min={symbolConfig?.lotStep}
                max={volumeLots}
                step={symbolConfig?.lotStep}
                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                className="EditOrderModal__field EditOrderModal__field--volumeLots"
                classNameError="EditOrderModal__field--customError"
                data-testid="EditOrderModal-volumeLotsInput"
                component={FormikInputField}
                disabled={!order.symbolConfig}
              />
              <Field
                name="closePrice"
                type="number"
                disabled={!initialSymbolPrice.current || !order.symbolConfig}
                className="EditOrderModal__field"
                placeholder={placeholder(order.digits)}
                step={step(digits)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                data-testid="EditOrderModal-closePriceInputDecimals"
                {...decimalsSettings}
              />
              <Button
                tertiary
                type="button"
                className="EditOrderModal__button EditOrderModal__button--update"
                data-testid="EditOrderModal-editOrderButton"
                disabled={!initialSymbolPrice.current || !order.symbolConfig}
                onClick={() => {
                  const _closePrice = direction === OrderDirection.SELL
                    ? currentPriceAsk
                    : currentPriceBid;
                  setFieldValue('closePrice', Number(_closePrice?.toFixed(digits)));
                }}
              >
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
              </Button>
              <Button
                type="submit"
                disabled={!initialSymbolPrice.current || !isValid || !order.symbolConfig}
                className="EditOrderModal__button"
                data-testid="EditOrderModal-closeOrderButton"
                danger
              >
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_CLOSE_ORDER', {
                  volumeLots: Number(_values.volumeLots).toFixed(2),
                  closePrice: (_values.closePrice || 0).toFixed(digits),
                })}
              </Button>
            </div>
            <div className="EditOrderModal__field-container">
              <div className="EditOrderModal__additional-info">
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.WITH_PNL')}&nbsp;
                <PnL
                  type={type}
                  openPrice={openPrice}
                  currentPriceBid={_values.closePrice || 0}
                  currentPriceAsk={_values.closePrice || 0}
                  volume={_values.volumeLots}
                  lotSize={symbolConfig?.lotSize || 0}
                  exchangeRate={currentSymbolPrice?.pnlRates[order.account.currency]}
                  loaderSize={16}
                />
              </div>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(CloseOpenOrderForm);
