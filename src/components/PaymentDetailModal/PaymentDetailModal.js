import React, { PureComponent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Field, reduxForm } from 'redux-form';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import {
  methodsLabels,
  manualPaymentMethodsLabels,
  manualPaymentMethods,
  tradingTypes as paymentsTypes,
  tradingTypes,
  statusMapper,
  statusesLabels,
  statuses,
} from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import Permissions from 'utils/permissions';
import ChangeOriginalAgent from 'components/ChangeOriginalAgent';
import Amount from '../Amount';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
import PaymentStatus from '../PaymentStatus';
import ShortLoader from '../ShortLoader';
import IpFlag from '../IpFlag';
import { NasSelectField } from '../ReduxForm/index';
import attributeLabels from './constants';
import { RejectForm, ApproveForm } from './ViewForm';
import './PaymentDetailModal.scss';

const formName = 'ChangePayment';
const ERROR_STATUS = 'ERROR_STATUS';
const ERROR_METHOD = 'ERROR_METHOD';
const ERROR = 'ERROR';

class PaymentDetailModal extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    acceptPayment: PropTypes.func.isRequired,
    payment: PropTypes.object.isRequired,
    playerProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    changePaymentMethod: PropTypes.func.isRequired,
    changePaymentStatus: PropTypes.func.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  onSubmit = typeAcc => async ({ paymentMethod, rejectionReason }) => {
    const {
      payment: { paymentId },
      acceptPayment,
      onCloseModal,
      onSuccess,
    } = this.props;

    const { data: { payment: { acceptPayment: { data: { success } } } } } = await acceptPayment({ variables: {
      paymentId,
      paymentMethod,
      declineReason: rejectionReason,
      typeAcc,
    },
    });

    if (success) {
      onCloseModal();
      onSuccess();
    }
  };

  get readOnly() {
    const { permissions: currentPermission } = this.context;
    const permittedRights = [
      permissions.PAYMENT.APPROVE,
      permissions.PAYMENT.REJECT,
      permissions.PAYMENT.CHANGE_STATUS,
      permissions.PAYMENT.CHANGE_METHOD,
    ];

    // INFO: if have permission return false
    return !(new Permissions(permittedRights).check(currentPermission));
  }

  handleSubmit = async ({ paymentMethod, paymentStatus }) => {
    const {
      payment: { paymentId },
      changePaymentMethod,
      changePaymentStatus,
      notify,
      onCloseModal,
      onSuccess,
    } = this.props;
    const errors = [];

    if (paymentMethod) {
      const {
        data: {
          payment: {
            changePaymentMethod: {
              data: { success },
            },
          },
        },
      } = await changePaymentMethod({
        variables: {
          paymentId,
          paymentMethod,
        },
      });

      if (!success) {
        errors.push(ERROR_METHOD);
      }
    }

    if (paymentStatus) {
      const {
        data: {
          payment: {
            changePaymentStatus: {
              data: { success },
            },
          },
        },
      } = await changePaymentStatus({
        variables: {
          paymentId,
          paymentStatus,
        },
      });

      if (!success) {
        errors.push(ERROR_STATUS);
      }
    }

    if (errors.length) {
      onCloseModal();

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t(`PAYMENT_DETAILS_MODAL.NOTIFICATIONS.${errors.length === 2 ? ERROR : errors[0]}`),
      });
    } else {
      onCloseModal();
      onSuccess();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });
    }
  };

  render() {
    const {
      payment,
      payment: {
        paymentId,
        paymentType,
        paymentMethod,
        creationTime,
        country,
        clientIp,
        mobile,
        userAgent,
        amount,
        currency,
        status,
        originalAgent,
      },
      playerProfile: {
        loading,
        playerProfile,
      },
      onCloseModal,
      className,
      handleSubmit,
      pristine,
      invalid,
      submitting,
    } = this.props;

    const isWithdraw = paymentType === paymentsTypes.WITHDRAW;
    const profile = get(playerProfile, 'data') || null;
    const error = get(playerProfile, 'error');

    return (
      <Modal isOpen toggle={onCloseModal} className={classNames(className, 'payment-detail-modal')}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          <Choose>
            <When condition={loading}>
              <ShortLoader height={25} />
            </When>
            <Otherwise>
              <ModalPlayerInfo
                playerProfile={error || profile}
                renderMiddleColumn={() => (
                  <ChangeOriginalAgent
                    paymentId={paymentId}
                    initialValues={{ agentId: originalAgent ? originalAgent.uuid : null }}
                  />
                )}
              />
              <div className="modal-body-tabs">
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
                  </div>
                  <div className="modal-header-tabs__label">
                    <Uuid uuid={paymentId} uuidPrefix="TA" />
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
                  </div>
                  <div className="modal-header-tabs__label">
                    {moment.utc(creationTime).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="font-size-11">
                    {moment.utc(creationTime).local().format('HH:mm')}
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    Ip
                  </div>
                  <IpFlag id={paymentId} country={country} ip={clientIp} />
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
                  </div>
                  <div className="margin-top-5">
                    <i
                      id={`payment-detail-${paymentId}-tooltip`}
                      className={`fa font-size-20 ${mobile ? 'fa-mobile' : 'fa-desktop'}`}
                    />
                    <UncontrolledTooltip
                      placement="bottom"
                      target={`payment-detail-${paymentId}-tooltip`}
                      delay={{
                        show: 350, hide: 250,
                      }}
                    >
                      {userAgent || 'User agent not defined'}
                    </UncontrolledTooltip>
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
                  </div>
                  <PaymentStatus payment={payment} />
                </div>
              </div>
              <div className="modal-footer-tabs">
                <div className="modal-footer-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}
                  </div>
                  <div
                    className={classNames('modal-footer-tabs__amount', { 'color-danger': isWithdraw })}
                  >
                    {isWithdraw && '-'}
                    <Amount amount={amount} currency={currency} />
                  </div>
                </div>
                <div className="modal-footer-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
                  </div>
                  <div className="modal-footer-tabs__amount">
                    <Choose>
                      <When condition={methodsLabels[paymentMethod]}>
                        {I18n.t(methodsLabels[paymentMethod])}
                      </When>
                      <Otherwise>
                        <Choose>
                          <When condition={manualPaymentMethodsLabels[paymentMethod]}>
                            {I18n.t(manualPaymentMethodsLabels[paymentMethod])}
                          </When>
                          <Otherwise>
                            <div>&mdash;</div>
                          </Otherwise>
                        </Choose>
                      </Otherwise>
                    </Choose>
                  </div>
                </div>
              </div>
            </Otherwise>
          </Choose>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex flex-column width-full">
            <Choose>
              <When condition={this.readOnly}>
                <div className="d-flex align-items-end justify-content-between width-full">
                  <Button className="btn btn-default" onClick={onCloseModal}>
                    {I18n.t('COMMON.DEFER')}
                  </Button>
                </div>
              </When>
              <Otherwise>
                <If condition={!statusMapper.PENDING.includes(status)}>
                  <form className="row">
                    <Field
                      label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_STATUS')}
                      className="col-6 mt-3 mx-auto"
                      component={NasSelectField}
                      name="paymentStatus"
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    >
                      {Object
                        .entries(statusMapper)
                        .filter(([item]) => item !== statuses.PENDING).map(([key, value]) => (
                          <option key={key} value={value[0]}>
                            {renderLabel(key, statusesLabels)}
                          </option>
                      ))}
                    </Field>
                    <Field
                      label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_PAYMENT_METHOD')}
                      className="col-6 mt-3 mx-auto"
                      component={NasSelectField}
                      name="paymentMethod"
                      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                    >
                      {Object.values(manualPaymentMethods).map(item => (
                        <option key={item} value={item}>
                          {I18n.t(manualPaymentMethodsLabels[item])}
                        </option>
                      ))}
                    </Field>
                  </form>
                </If>
                <div className="d-flex align-items-end justify-content-between width-full">
                  <Button className="btn btn-default" onClick={onCloseModal}>
                    {I18n.t('COMMON.DEFER')}
                  </Button>
                  <If condition={!statusMapper.PENDING.includes(status)}>
                    <Button
                      onClick={handleSubmit(this.handleSubmit)}
                      className="margin-left-15 btn btn-primary"
                      disabled={pristine || invalid || submitting}
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </If>
                  <If condition={paymentType === tradingTypes.WITHDRAW && statusMapper.PENDING.includes(status)}>
                    <ApproveForm onSubmit={this.onSubmit} />
                    <RejectForm onSubmit={this.onSubmit} />
                  </If>
                </div>
              </Otherwise>
            </Choose>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: values => createValidator({
    paymentMethod: ['string'],
    paymentStatus: ['string'],
  }, translateLabels(attributeLabels), false)(values),
})(PaymentDetailModal);
