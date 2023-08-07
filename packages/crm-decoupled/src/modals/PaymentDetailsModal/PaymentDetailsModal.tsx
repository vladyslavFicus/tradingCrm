import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { getBrand } from 'config';
import { Payment } from '__generated__/types';
import formatLabel from 'utils/formatLabel';
import { createValidator, translateLabels } from 'utils/validator';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { tradingTypes, statusMapper, tradingStatuses } from 'constants/payment';
import { FormikDatePicker } from 'components/Formik';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import ChangeOriginalAgent from 'components/ChangeOriginalAgent';
import PaymentStatus from 'components/PaymentStatus';
import ShortLoader from 'components/ShortLoader';
import IpFlag from 'components/IpFlag';
import Modal from 'components/Modal';
import { Button } from 'components';
import Uuid from 'components/Uuid';
import ChangePaymentStatusForm from './components/ChangePaymentStatusForm';
import ApprovePaymentForm from './components/ApprovePaymentForm';
import RejectPaymentForm from './components/RejectPaymentForm';
import ChangePaymentSystemForm from './components/ChangePaymentSystemForm';
import { useChangeCreationTimeMutation } from './graphql/__generated__/ChangeCreationTimeMutation';
import { useProfileQuery } from './graphql/__generated__/ProfileQuery';
import './PaymentDetailsModal.scss';

type Agent = {
  uuid: string,
  fullName: string,
};

type FormValues = {
  creationTime: string,
}

export type Props = {
  payment: Payment,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const PaymentDetailsModal = (props: Props) => {
  const {
    payment: {
      playerProfile: {
        firstName,
        lastName,
        uuid,
      },
      paymentId,
      originalAgent,
      paymentType,
      creationTime,
      paymentMethod,
      paymentAggregator,
      paymentMetadata,
      status,
    },
    payment,
    onSuccess,
    onCloseModal,
  } = props;

  const { data, loading } = useProfileQuery({ variables: { playerUUID: uuid } });
  const { amount, credit } = data?.profile?.profileView?.balance || {};

  const currency = getBrand().currencies.base;

  const permission = usePermission();

  const [changeCreationTimeMutation] = useChangeCreationTimeMutation();

  const onAcceptSuccess = () => {
    onSuccess();

    onCloseModal();
  };

  const renderProfileInfoBlock = () => (
    <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
      <div className="PaymentDetailsModal__block-title">{I18n.t('COMMON.CLIENT')}</div>

      <div className="PaymentDetailsModal__block-label">{`${firstName} ${lastName}`}</div>

      <div className="PaymentDetailsModal__block-secondary">
        <Uuid
          uuid={uuid}
          uuidPrefix={uuid.indexOf('PLAYER') === -1 ? 'PL' : undefined}
        />
      </div>
    </div>
  );

  const renderChangeOriginalAgentBlock = () => (
    <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
      <ChangeOriginalAgent
        paymentId={paymentId}
        originalAgent={originalAgent as Agent}
        onSuccess={onSuccess}
      />
    </div>
  );

  const renderProfileBalanceBlock = () => (
    <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
      <div className="PaymentDetailsModal__block-title">{I18n.t('COMMON.BALANCE')}</div>

      <div className="PaymentDetailsModal__block-label">
        {currency} {I18n.toCurrency(amount || 0, { unit: '' })}
      </div>

      <div className="PaymentDetailsModal__block-secondary">
        {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}: {currency} {I18n.toCurrency(credit || 0, { unit: '' })}
      </div>
    </div>
  );

  const renderTransactionInfoBlock = () => (
    <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
      <div className="PaymentDetailsModal__block-title">
        {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
      </div>

      <div className="PaymentDetailsModal__block-label">
        <Uuid uuid={paymentId} uuidPrefix="TA" />
      </div>
    </div>
  );

  const handleChangeCreationTime = async ({ creationTime: timeOfCreation }: FormValues,
    { resetForm }: FormikHelpers<FormValues>) => {
    try {
      await changeCreationTimeMutation({
        variables: {
          paymentId,
          creationTime: timeOfCreation,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PAYMENT_DETAILS_MODAL.CREATION_TIME'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });

      resetForm({ values: { creationTime: timeOfCreation } });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PAYMENT_DETAILS_MODAL.CREATION_TIME'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const renderDateAndTimeBlock = () => {
    const canChangeCreationTime = permission.allows(permissions.PAYMENT.CHANGE_CREATION_TIME);

    return (
      <div className="PaymentDetailsModal__block">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
        </div>

        <Formik
          initialValues={{ creationTime }}
          onSubmit={handleChangeCreationTime}
          validate={
            createValidator({
              creationTime: ['required', 'dateWithTime'],
            }, translateLabels({ creationTime: 'PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME' }), false)
          }
        >
          {({ isSubmitting, dirty, isValid }) => (
            <Form>
              <Choose>
                <When condition={canChangeCreationTime}>
                  <Field
                    name="creationTime"
                    className="PaymentDetailsModal__date-picker"
                    component={FormikDatePicker}
                    withTime
                    withUtc
                  />

                  <div className="PaymentDetailsModal__button">
                    <Button
                      disabled={!dirty || !isValid || isSubmitting}
                      type="submit"
                      primary
                      small
                    >
                      {I18n.t('COMMON.SAVE')}
                    </Button>
                  </div>
                </When>

                <Otherwise>
                  <div className="PaymentDetailsModal__block-label">
                    {moment.utc(creationTime).local().format('DD.MM.YYYY')}
                  </div>

                  <div className="PaymentDetailsModal__block-secondary">
                    {moment.utc(creationTime).local().format('HH:mm')}
                  </div>
                </Otherwise>
              </Choose>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  const renderIPBlock = () => {
    const { clientIp, country } = paymentMetadata || {};

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">Ip</div>

        <div className="PaymentDetailsModal__block-ips">
          <IpFlag id={paymentId} country={country || ''} ip={clientIp || ''} />
        </div>
      </div>
    );
  };

  const renderDeviceBlock = () => {
    const { mobile, userAgent } = paymentMetadata || {};

    /**
     * some payment types have uuid name without prefix like `PAYMENT`
     * and our awesome ReactStrap lib can't find element in DOM if
     * it's id name begins with digit character.
     * So we need make a crutch with adding literal prefix to id
     */
    const tooltipId = `tooltip-${paymentId}`;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
        </div>

        <div className="PaymentDetailsModal__block-device-info">
          <i
            id={tooltipId}
            className={`fa ${mobile ? 'fa-mobile' : 'fa-desktop'}`}
          />

          <UncontrolledTooltip
            placement="bottom"
            target={tooltipId}
            delay={{ show: 350, hide: 250 }}
            fade={false}
          >
            {userAgent || 'User agent not defined'}
          </UncontrolledTooltip>
        </div>
      </div>
    );
  };

  const renderStatusBlock = () => (
    <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
      <div className="PaymentDetailsModal__block-title">
        {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
      </div>

      <div className="PaymentDetailsModal__block-status">
        <PaymentStatus
          creationTime={creationTime}
          paymentId={paymentId}
          status={status}
        />
      </div>
    </div>
  );

  const renderAmountBlock = (isWithdraw: boolean) => {
    const { amount: paymentAmount, currency: paymentCurrency } = payment;

    return (
      <div className="PaymentDetailsModal__block">
        <div className="PaymentDetailsModal__block-title PaymentDetailsModal__block-title--right">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}
        </div>

        <div
          className={
            classNames('PaymentDetailsModal__block-amount', {
              'PaymentDetailsModal__block-amount--red': isWithdraw,
            })
          }
        >
          {isWithdraw && '-'}
          {I18n.toCurrency(paymentAmount || 0, { unit: '' })} {paymentCurrency}
        </div>
      </div>
    );
  };

  const renderPaymentMethodBlock = () => (
    <div className="PaymentDetailsModal__block">
      <div className="PaymentDetailsModal__block-title">
        {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
      </div>

      <div className="PaymentDetailsModal__block-payment-status">
        <Choose>
          <When condition={!!paymentMethod}>
            {formatLabel(paymentMethod || '', false)}
          </When>

          <Otherwise>
            &mdash;
          </Otherwise>
        </Choose>
      </div>
    </div>
  );

  const inPendingStatus = statusMapper.PENDING.includes(status as tradingStatuses);
  const isWithdraw = paymentType === tradingTypes.WITHDRAW;

  const canApprove = permission.allows(permissions.PAYMENT.APPROVE);
  const canReject = permission.allows(permissions.PAYMENT.REJECT);
  const canChangeStatus = permission.allows(permissions.PAYMENT.CHANGE_STATUS);
  const canChangeMethod = permission.allows(permissions.PAYMENT.CHANGE_METHOD);
  const canChangeSystem = permission.allows(permissions.PAYMENT.CHANGE_SYSTEM);

  return (
    <Modal
      onCloseModal={onCloseModal}
      title={I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}
      renderFooter={(
        <Button
          onClick={onCloseModal}
          secondary
        >
          {I18n.t('COMMON.DEFER')}
        </Button>
      )}
    >
      <Choose>
        <When condition={loading}>
          <div className="PaymentDetailsModal__loader">
            <ShortLoader height={25} />
          </div>
        </When>

        <Otherwise>
          <div className="PaymentDetailsModal__row PaymentDetailsModal__row--with-underline">
            {renderProfileInfoBlock()}
            {renderChangeOriginalAgentBlock()}
            {renderProfileBalanceBlock()}
          </div>

          <div className="PaymentDetailsModal__row">
            {renderTransactionInfoBlock()}
            {renderDateAndTimeBlock()}
            {renderDeviceBlock()}
            {renderIPBlock()}
            {renderStatusBlock()}
          </div>

          <div className="PaymentDetailsModal__row PaymentDetailsModal__row--blue">
            {renderAmountBlock(isWithdraw)}
            {renderPaymentMethodBlock()}
          </div>

          <If condition={canChangeMethod && canChangeStatus && !inPendingStatus}>
            <div className="PaymentDetailsModal__row">
              <ChangePaymentStatusForm
                disablePaymentMethod={payment.paymentMethod === 'COMMISSION'}
                onSuccess={onSuccess}
                paymentId={paymentId}
                onCloseModal={onCloseModal}
              />
            </div>
          </If>

          <If condition={(canApprove || canReject) && isWithdraw && inPendingStatus}>
            <div className="PaymentDetailsModal__row">
              <If condition={canReject}>
                <RejectPaymentForm
                  paymentId={paymentId}
                  onSuccess={onAcceptSuccess}
                />
              </If>

              <If condition={canApprove}>
                <ApprovePaymentForm
                  paymentId={paymentId}
                  onSuccess={onAcceptSuccess}
                />
              </If>
            </div>
          </If>

          <If condition={canChangeSystem
                && ['CHARGEBACK', 'CREDIT_CARD', 'RECALL', 'WIRE'].includes(paymentMethod || '')
                && (paymentType === 'DEPOSIT' || paymentType === 'WITHDRAW')
                && paymentAggregator === 'MANUAL'}
          >
            <div className="PaymentDetailsModal__row">
              <ChangePaymentSystemForm
                onSuccess={onSuccess}
                paymentId={paymentId}
              />
            </div>
          </If>
        </Otherwise>
      </Choose>
    </Modal>
  );
};

export default React.memo(PaymentDetailsModal);
