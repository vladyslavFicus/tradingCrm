import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import { LevelType, Modal, Notify } from 'types';
import { withModals, withNotifications } from 'hoc';
import permissions from 'config/permissions';
import { OrderStatus, OrderType } from 'types/trading-engine';
import { Permission } from 'types/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import Input from 'components/Input';
import { FormikDatePicker, FormikInputDecimalsField, FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { round } from 'utils/round';
import { calculateMargin, calculatePnL } from 'routes/TE/utils/formulas';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import ReopenOrderButton from '../ReopenOrderButton';
import CancelOrderButton from '../CancelOrderButton';
import { OrderQuery } from '../../graphql/__generated__/OrderQuery';
import { useEditOrderMutation } from './graphql/__generated__/EditOrderMutation';
import { useEditOrderAdminMutation } from './graphql/__generated__/EditOrderAdminMutation';
import { reasons } from './constants';

interface Props {
  order: OrderQuery['tradingEngine']['order'],
  onSuccess: (shouldCloseModal?: boolean) => void,
  notify: Notify,
  permission: Permission,
  modals: {
    confirmationModal: Modal,
  },
}

interface FormValues {
  reason: string,
  volume: number,
  symbol: string,
  openPrice: number,
  openTime: string,
  closePrice: number | null,
  closeTime: string | null,
  commission: number,
  swaps: number,
  comment: string | null,
  takeProfit: number | null,
  stopLoss: number | null,
}

const EditOrderForm = (props: Props) => {
  const {
    order,
    onSuccess,
    notify,
    modals: {
      confirmationModal,
    },
  } = props;

  const {
    id,
    time,
    type,
    symbol,
    status,
    reason,
    commission,
    swaps,
    digits,
    stopLoss,
    takeProfit,
    volumeLots,
    openPrice,
    closePrice,
    openRate,
    closeRate,
    margin,
    marginRate,
    pnl,
    comment,
    accountLogin,
    account,
    symbolConfig,
    symbolEntity,
  } = order;

  const permission = usePermission();

  const [editOrder] = useEditOrderMutation();
  const [editOrderAdmin] = useEditOrderAdminMutation();

  const currentSymbolPrice = useSymbolPricesStream(symbol);

  // Get current BID and ASK prices with applied group spread
  const currentPriceBid = round((currentSymbolPrice?.bid || 0) - (symbolConfig?.bidAdjustment || 0), digits);
  const currentPriceAsk = round((currentSymbolPrice?.ask || 0) + (symbolConfig?.askAdjustment || 0), digits);

  // Input settings
  const decimalsSettings = {
    decimalsLimit: digits,
    decimalsWarningMessage: I18n.t('TRADING_ENGINE.DECIMALS_WARNING_MESSAGE', {
      symbol,
      digits,
    }),
    decimalsLengthDefault: digits,
  };

  // Permissions
  const isAdminEditAllowed = permission.allows(permissions.WE_TRADING.ADMIN_EDIT_ORDER);
  const isManagerEditAllowed = permission.allows(permissions.WE_TRADING.MANAGER_EDIT_ORDER);
  const isReopenAllowed = permission.allows(permissions.WE_TRADING.ORDER_REOPEN);
  const isCancelAllowed = permission.allows(permissions.WE_TRADING.ORDER_CANCEL);

  const isEditAllowed = isManagerEditAllowed || isAdminEditAllowed;

  // Edit disabled for CANCELED order or for CLOSED order if no exist ADMIN_EDIT permission or symbolConfig is empty
  const isOrderEditDisabled = order.status === OrderStatus.CANCELED
  || (order.status === OrderStatus.CLOSED && !isAdminEditAllowed)
  || !order.symbolConfig;

  const handleEditOrder = async (values: FormValues) => {
    confirmationModal.show({
      modalTitle: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TITLE'),
      actionText: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CONFIRMATION.CHANGE_ORDER_TEXT', { id }),
      submitButtonLabel: I18n.t('COMMON.YES'),
      cancelButtonLabel: I18n.t('COMMON.NO'),
      className: 'EditOrderModal__confirmation-modal',
      onSubmit: async () => {
        try {
          // Execute admin edit endpoint if permission exist
          if (isAdminEditAllowed) {
            await editOrderAdmin({
              variables: {
                args: {
                  ...values,
                  orderId: id,
                  closePrice: status === OrderStatus.OPEN ? null : values.closePrice,
                },
              },
            });
            // In other cases execute manager edit
          } else {
            await editOrder({
              variables: {
                ...values,
                orderId: id,
              },
            });
          }

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.SUCCESS'),
          });

          await onSuccess(false);
        } catch (_) {
          notify({
            level: LevelType.ERROR,
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NOTIFICATION.FAILED'),
          });
        }
      },
    });
  };

  return (
    <Formik
      initialValues={{
        symbol,
        swaps,
        reason,
        comment,
        openPrice,
        closePrice,
        commission,
        takeProfit,
        volume: volumeLots,
        stopLoss,
        openTime: time?.creation,
        closeTime: time?.closing,
      }}
      validate={createValidator({
        openPrice: ['required'],
        volume: isAdminEditAllowed && [
          'required',
          'numeric',
          `min:${symbolConfig?.lotStep}`,
          `max:${symbolConfig?.lotMax}`,
          `step:${symbolConfig?.lotStep}`,
        ],
      }, {
        openPrice: I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE'),
        volume: I18n.t('TRADING_ENGINE.MODALS.COMMON_NEW_ORDER_MODAL.VOLUME'),
      }, false)}
      onSubmit={handleEditOrder}
      enableReinitialize
    >
      {({ values, isSubmitting, dirty, isValid }) => {
        const currentClosePrice = type === OrderType.SELL ? currentPriceAsk : currentPriceBid;

        // Close price is value from BE or calculated manually on FE side
        const _closePrice = values.closePrice ?? closePrice ?? currentClosePrice;

        const floatingPnL = calculatePnL({
          type,
          currentPriceBid,
          currentPriceAsk,
          openPrice: values.openPrice,
          volume: values.volume,
          lotSize: symbolConfig?.lotSize,
          exchangeRate: currentSymbolPrice?.pnlRates[account.currency],
        });

        const floatingMargin = calculateMargin({
          symbolType: symbolEntity?.symbolType,
          openPrice: values.openPrice,
          volume: values.volume,
          lotSize: symbolConfig?.lotSize,
          leverage: account.leverage,
          marginRate,
          percentage: symbolConfig?.percentage,
        });

        return (
          <Form>
            <fieldset className="EditOrderModal__fieldset">
              <legend className="EditOrderModal__fieldset-title">
                {accountLogin}
              </legend>

              <div className="EditOrderModal__field-container">
                <Input
                  disabled
                  name="order"
                  value={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
                    id,
                    type: I18n.t(`TRADING_ENGINE.ORDERS.FILTER_FORM.TYPES.${type}`),
                    volumeLots,
                    symbol,
                  })}
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.ORDER')}
                  className="EditOrderModal__field"
                />

                {/* Only who has permissions to admin edit order can see these data */}
                <If condition={isAdminEditAllowed}>
                  <Field
                    name="reason"
                    component={FormikSelectField}
                    className="EditOrderModal__field"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.REASON')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    disabled={isOrderEditDisabled}
                  >
                    {reasons.map(({ value, label }) => (
                      <option key={value} value={value}>{I18n.t(label)}</option>
                    ))}
                  </Field>
                </If>
              </div>

              {/* Only who has permissions to admin edit order can see these data */}
              <If condition={isAdminEditAllowed}>
                <div className="EditOrderModal__field-container">
                  <Field
                    name="volume"
                    type="number"
                    placeholder="0.00"
                    min={symbolConfig?.lotStep}
                    max={symbolConfig?.lotMax}
                    step={symbolConfig?.lotStep}
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.VOLUME')}
                    className="EditOrderModal__field"
                    component={FormikInputField}
                    disabled={isOrderEditDisabled}
                  />
                  <Field
                    disabled
                    name="symbol"
                    component={FormikSelectField}
                    className="EditOrderModal__field"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.SYMBOL')}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  >
                    {[<option key={symbol} value={symbol}>{symbol}</option>]}
                  </Field>
                </div>
              </If>

              <div className="EditOrderModal__field-container">
                <Field
                  autoFocus
                  name="openPrice"
                  type="number"
                  step="0.00001"
                  placeholder={`0.${'0'.repeat(digits || 4)}`}
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_PRICE')}
                  className="EditOrderModal__field"
                  component={FormikInputDecimalsField}
                  disabled={!isEditAllowed || isOrderEditDisabled}
                  {...decimalsSettings}
                />
                <Field
                  name="openTime"
                  className="EditOrderModal__field"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_TIME')}
                  component={FormikDatePicker}
                  withTime
                  withUtc
                  disabled={!isAdminEditAllowed || isOrderEditDisabled}
                />
              </div>

              <div className="EditOrderModal__field-container">
                <Field
                  name="stopLoss"
                  type="number"
                  step="0.00001"
                  placeholder={`0.${'0'.repeat(digits || 4)}`}
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.STOP_LOSS')}
                  className="EditOrderModal__field"
                  component={FormikInputDecimalsField}
                  disabled={!isEditAllowed || isOrderEditDisabled}
                  {...decimalsSettings}
                />
                <Field
                  name="takeProfit"
                  type="number"
                  step="0.00001"
                  placeholder={`0.${'0'.repeat(digits || 4)}`}
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TAKE_PROFIT')}
                  className="EditOrderModal__field"
                  component={FormikInputDecimalsField}
                  disabled={!isEditAllowed || isOrderEditDisabled}
                  {...decimalsSettings}
                />
              </div>

              <If condition={status === OrderStatus.CLOSED}>
                <div className="EditOrderModal__field-container">
                  <Field
                    disabled={isOrderEditDisabled}
                    name="closePrice"
                    type="number"
                    step="0.00001"
                    placeholder="0.00"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_PRICE')}
                    className="EditOrderModal__field"
                    value={_closePrice}
                    component={FormikInputField}
                  />
                  <Field
                    disabled={isOrderEditDisabled}
                    name="closeTime"
                    className="EditOrderModal__field"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_TIME')}
                    component={FormikDatePicker}
                    withTime
                    withUtc
                  />
                </div>
              </If>

              <If condition={!!time?.expiration}>
                <div className="EditOrderModal__field-container">
                  <Input
                    disabled
                    name="expiry"
                    // @ts-expect-error 'time.closing' can be null and TS not working with JSX control statements
                    value={moment.utc(time.expiration).local().format('DD.MM.YYYY HH:mm:ss')}
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.EXPIRY')}
                    className="EditOrderModal__field"
                  />
                </div>
              </If>

              {/* Only who has permissions to admin edit order can see these data */}
              <If condition={isAdminEditAllowed}>
                <div className="EditOrderModal__field-container">
                  <Input
                    disabled
                    name="openRate"
                    type="number"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.OPEN_RATE')}
                    className="EditOrderModal__field"
                    value={openRate}
                  />
                  <Input
                    disabled
                    name="closeRate"
                    type="number"
                    placeholder="0.00"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.CLOSE_RATE')}
                    className="EditOrderModal__field"
                    value={closeRate || 0}
                  />
                </div>
              </If>

              <div className="EditOrderModal__field-container">
                <Field
                  name="commission"
                  type="number"
                  step="0.00001"
                  placeholder="0.00"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.COMMISSION')}
                  className="EditOrderModal__field"
                  component={FormikInputField}
                  disabled={!isAdminEditAllowed || isOrderEditDisabled}
                />
                <Field
                  name="swaps"
                  type="number"
                  step="0.00001"
                  placeholder="0.00"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.SWAPS')}
                  className="EditOrderModal__field"
                  component={FormikInputField}
                  disabled={!isAdminEditAllowed || isOrderEditDisabled}
                />
              </div>

              <If condition={order.status !== OrderStatus.PENDING}>
                <div className="EditOrderModal__field-container">
                  <Input
                    disabled
                    name="pnl"
                    value={status === OrderStatus.OPEN ? floatingPnL.toFixed(2) : pnl?.gross?.toFixed(2)}
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.FLOATING_PL')}
                    className="EditOrderModal__field"
                  />

                  <Input
                    disabled
                    name="netPnL"
                    value={
                      status === OrderStatus.OPEN
                        ? (floatingPnL + commission + swaps).toFixed(2)
                        : (pnl.gross + commission + swaps).toFixed(2)
                    }
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.NET_FLOATING')}
                    className="EditOrderModal__field"
                  />

                  <Input
                    disabled
                    name="margin"
                    type="number"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.MARGIN')}
                    className="EditOrderModal__field"
                    // Show floating required margin only for OPEN orders. In other cases show value from BE.
                    value={status === OrderStatus.OPEN ? floatingMargin : margin}
                  />
                </div>
              </If>

              <div className="EditOrderModal__field-container">
                <Field
                  name="comment"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.COMMENT')}
                  className="EditOrderModal__field"
                  component={FormikInputField}
                  maxLength={1000}
                  disabled={!isEditAllowed || isOrderEditDisabled}
                />
              </div>

              <If condition={
                status !== OrderStatus.CANCELED && (isEditAllowed || isReopenAllowed || isCancelAllowed)
              }
              >
                <div className="EditOrderModal__field-container EditOrderModal__field-container-button">
                  <If condition={isEditAllowed}>
                    <Button
                      danger
                      type="submit"
                      className="EditOrderModal__button"
                      disabled={!dirty || isSubmitting || !isEditAllowed || !isValid}
                      data-testid="updateOrder"
                    >
                      {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.UPDATE')}
                    </Button>
                  </If>

                  <If condition={status === OrderStatus.CLOSED && isReopenAllowed}>
                    <ReopenOrderButton order={order} onSuccess={onSuccess} />
                  </If>

                  <If condition={isCancelAllowed}>
                    <CancelOrderButton order={order} onSuccess={onSuccess} />
                  </If>
                </div>
              </If>
            </fieldset>
          </Form>
        );
      }}
    </Formik>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(EditOrderForm);
