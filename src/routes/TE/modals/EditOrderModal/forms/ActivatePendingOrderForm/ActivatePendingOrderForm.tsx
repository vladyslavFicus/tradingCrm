import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import compose from 'compose-function';
import { LevelType, Notify } from 'types';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormikInputDecimalsField, FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { placeholder, step } from 'routes/TE/utils/inputHelper';
import { OrderDirection } from 'types/trading-engine';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import Margin from 'routes/TE/components/Margin';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useActivatePendingOrderMutation } from './graphql/__generated__/ActivatePendingOrderMutation';

type Props = {
  order: OrderQuery['tradingEngine']['order'],
  onSuccess: (shouldCloseModal?: boolean) => void,
  notify: Notify,
}

type FormValues = {
  volumeLots: number,
  activationPrice: number,
}

const ActivatePendingOrderForm = (props: Props) => {
  const {
    order,
    onSuccess,
    notify,
  } = props;

  const {
    id,
    symbol,
    digits,
    volumeLots,
    openPrice,
    direction,
    symbolConfig,
    symbolEntity,
    account,
  } = order;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const [activatePendingOrder] = useActivatePendingOrderMutation();

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  // Get current BID and ASK prices with applied group spread
  const currentPriceBid = round((currentSymbolPrice?.bid || 0) - (symbolConfig?.bidAdjustment || 0), digits);
  const currentPriceAsk = round((currentSymbolPrice?.ask || 0) + (symbolConfig?.askAdjustment || 0), digits);

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
  const handleActivatePendingOrder = async (values: FormValues) => {
    confirmActionModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.PENDING_ORDER_TITLE'),
      actionText: I18n.t(
        'TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.PENDING_ORDER_TEXT',
        { id, activationPrice: values.activationPrice.toFixed(digits) },
      ),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          await activatePendingOrder({
            variables: {
              orderId: id,
              activationPrice: values.activationPrice,
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.PENDING_SUCCESS'),
          });

          onSuccess(true);
        } catch (e) {
          const { message } = parseErrors(e);

          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message,
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
        activationPrice: openPrice,
      }}
      validate={createValidator({
        volumeLots: ['required', 'numeric', 'max:1000', 'min:0.01'],
      }, {
        volumeLots: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME'),
      })}
      onSubmit={handleActivatePendingOrder}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <fieldset className="EditOrderModal__fieldset">
            <legend className="EditOrderModal__fieldset-title">
              {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.PENDING_ORDER')}
            </legend>

            <div className="EditOrderModal__field-container">
              <Field
                name="volumeLots"
                type="number"
                step="0.01"
                placeholder="0.00"
                min={0.01}
                max={1000}
                label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                className="EditOrderModal__field EditOrderModal__field--volumeLots"
                classNameError="EditOrderModal__field--customError"
                component={FormikInputField}
                disabled
              />
              <Field
                name="activationPrice"
                type="number"
                className="EditOrderModal__field"
                placeholder={placeholder(order.digits)}
                step={step(digits)}
                min={0}
                max={999999}
                component={FormikInputDecimalsField}
                data-testid="activationPrice"
                {...decimalsSettings}
              />
              <Button
                type="button"
                tertiary
                className="EditOrderModal__button EditOrderModal__button--update"
                onClick={() => {
                  const _activationPrice = direction === OrderDirection.SELL
                    ? currentPriceBid
                    : currentPriceAsk;
                  setFieldValue('activationPrice', Number(_activationPrice?.toFixed(digits)));
                }}
              >
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
              </Button>
              <Button
                type="submit"
                className="EditOrderModal__button"
                danger
              >
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.BUTTON_ACTIVATE_PENDING_ORDER', {
                  volumeLots: Number(values.volumeLots).toFixed(2),
                  activationPrice: (values.activationPrice || 0).toFixed(digits),
                })}
              </Button>
            </div>
            <div className="EditOrderModal__field-container">
              <div className="EditOrderModal__additional-info">
                {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.REQUIRED_MARGIN')}&nbsp;
                <Margin
                  symbolType={symbolEntity?.symbolType}
                  openPrice={values.activationPrice}
                  volume={values.volumeLots}
                  lotSize={symbolConfig?.lotSize}
                  leverage={account.leverage}
                  marginRate={currentSymbolPrice?.marginRates[account.currency]}
                  percentage={symbolConfig?.percentage}
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

export default compose(
  React.memo,
  withNotifications,
)(ActivatePendingOrderForm);
