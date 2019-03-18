import React, { PureComponent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { RejectForm, ApproveForm } from './ViewForm';
import PropTypes from '../../constants/propTypes';
import {
  methodsLabels,
  manualPaymentMethodsLabels,
  tradingTypes as paymentsTypes,
  tradingTypes,
  statusMapper,
} from '../../constants/payment';
import Amount from '../Amount';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
import PaymentStatus from '../PaymentStatus';
import ShortLoader from '../ShortLoader';
import IpFlag from '../IpFlag';
import './PaymentDetailModal.scss';

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
  }

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
      },
      playerProfile: {
        loading,
        playerProfile,
      },
      onCloseModal,
      className,
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
              <ModalPlayerInfo playerProfile={error || profile} />
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
          <div className={
            classNames(
              'col-2',
              paymentType === tradingTypes.WITHDRAW && statusMapper.PENDING.indexOf(status) !== -1 && 'button-defer'
            )
          }
          >
            <Button
              onClick={onCloseModal}
              className="mr-auto"
            >
              {I18n.t('COMMON.DEFER')}
            </Button>
          </div>
          <If condition={paymentType === tradingTypes.WITHDRAW && statusMapper.PENDING.indexOf(status) !== -1}>
            <ApproveForm onSubmit={this.onSubmit} />
            <RejectForm onSubmit={this.onSubmit} />
          </If>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PaymentDetailModal;
