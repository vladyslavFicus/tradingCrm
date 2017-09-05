import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import {
  methodsLabels as paymentsMethodsLabels,
  types as paymentsTypes,
  paymentActions,
  statuses as paymentStatuses,
} from '../../constants/payment';
import Amount from '../Amount';
import NoteButton from '../NoteButton';
import { shortify } from '../../utils/uuid';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import PermissionContent from '../PermissionContent';
import Permissions from '../../utils/permissions';
import permission from '../../config/permissions';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
import TransactionStatus from '../TransactionStatus';
import renderLabel from '../../utils/renderLabel';
import PaymentAccount from '../PaymentAccount';

const approvePendingWithdraw = new Permissions([permission.PAYMENTS.APPROVE_WITHDRAW]);
const chargebackCompletedDeposit = new Permissions([permission.PAYMENTS.CHARGEBACK_DEPOSIT]);

class PaymentDetailModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onNoteClick: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    onAskReason: PropTypes.func.isRequired,
    payment: PropTypes.paymentEntity.isRequired,
    playerProfile: PropTypes.userProfile.isRequired,
  };
  static defaultProps = {
    className: '',
  };

  handleApproveClick = () => {
    const { payment: { paymentId, playerUUID }, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus(paymentActions.APPROVE, playerUUID, paymentId);
  };

  handleRejectClick = () => {
    const { payment, playerProfile, onAskReason, onChangePaymentStatus } = this.props;

    return onAskReason({
      title: 'Withdrawal rejection',
      description: `You are about to reject withdraw transaction ${shortify(payment.paymentId, 'TA')} from`,
      submitButtonLabel: 'Reject withdraw transaction',
      action: paymentActions.REJECT,
      payment,
      playerProfile,
      initialValues: {
        action: paymentActions.CHARGEBACK,
        playerUUID: playerProfile.playerUUID,
        paymentId: payment.paymentId,
      },
      customReason: true,
      onSubmit: onChangePaymentStatus,
    });
  };

  handleChargebackClick = () => {
    const { payment, playerProfile, onAskReason, onChangePaymentStatus } = this.props;

    return onAskReason({
      title: 'Deposit chargeback',
      description: `You are about to mark the deposit transaction ${shortify(payment.paymentId, 'TA')} as chargeback in`,
      submitButtonLabel: 'Confirm',
      action: paymentActions.CHARGEBACK,
      payment,
      playerProfile,
      initialValues: {
        action: paymentActions.CHARGEBACK,
        playerUUID: playerProfile.playerUUID,
        paymentId: payment.paymentId,
      },
      customReason: true,
      onSubmit: onChangePaymentStatus,
    });
  };

  renderFooter = () => {
    const { onClose, payment: { status, paymentType } } = this.props;
    let actions = null;

    if (paymentType === paymentsTypes.Withdraw && status === paymentStatuses.PENDING) {
      actions = (
        <span>
          <PermissionContent permissions={approvePendingWithdraw}>
            <Button
              color="primary"
              onClick={this.handleApproveClick}
            >
              {I18n.t('COMMON.APPROVE')}
            </Button>
          </PermissionContent>
          <Button
            color="danger"
            onClick={this.handleRejectClick}
          >
            {I18n.t('COMMON.REJECT')}
          </Button>
        </span>
      );
    }

    if (paymentType === paymentsTypes.Deposit && status === paymentStatuses.COMPLETED) {
      actions = (
        <span>
          <PermissionContent permissions={chargebackCompletedDeposit}>
            <Button
              color="danger"
              onClick={this.handleChargebackClick}
            >
              Mark as chargeback
            </Button>
          </PermissionContent>
        </span>
      );
    }

    return (
      <ModalFooter>
        <Button
          onClick={onClose}
          className="pull-left"
        >
          {I18n.t('COMMON.DEFER')}
        </Button>
        {
          actions &&
          <span className="payment-details-actions">
            {actions}
          </span>
        }
      </ModalFooter>
    );
  };

  render() {
    const {
      payment,
      playerProfile,
      onClose,
      className,
      onNoteClick,
    } = this.props;
    const isWithdraw = payment.paymentType === paymentsTypes.Withdraw;

    return (
      <Modal isOpen toggle={onClose} className={classNames(className, 'payment-detail-modal')}>
        <ModalHeader toggle={onClose}>{I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}</ModalHeader>

        <ModalBody>
          <ModalPlayerInfo playerProfile={playerProfile} />
          <div className="modal-body-tabs">
            <div className="modal-body-tabs__item">
              <div className="modal-tab-label">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
              </div>
              <div className="modal-header-tabs__label">
                <Uuid uuid={payment.paymentId} uuidPrefix="TA" />
              </div>
              <div className="font-size-11">
                {'by '}
                <Uuid
                  uuid={payment.playerUUID}
                  uuidPrefix={payment.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
                />
              </div>
            </div>
            <div className="modal-body-tabs__item">
              <div className="modal-tab-label">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
              </div>
              <div className="modal-header-tabs__label">
                {moment(payment.creationTime).format('DD.MM.YYYY')}
              </div>
              <div className="font-size-11">
                {moment(payment.creationTime).format('HH:mm')}
              </div>
            </div>
            <div className="modal-body-tabs__item">
              <div className="modal-tab-label">
                Ip
              </div>
              {payment.country && <i className={`fs-icon fs-${payment.country.toLowerCase()}`} />}
            </div>
            <div className="modal-body-tabs__item">
              <div className="modal-tab-label">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
              </div>
              <div className="margin-top-5">
                <i
                  id={`payment-detail-${payment.paymentId}-tooltip`}
                  className={`fa font-size-20 ${payment.mobile ? 'fa-mobile' : 'fa-desktop'}`}
                />
                <UncontrolledTooltip
                  placement="bottom"
                  target={`payment-detail-${payment.paymentId}-tooltip`}
                  delay={{
                    show: 350, hide: 250,
                  }}
                >
                  {payment.userAgent || 'User agent not defined'}
                </UncontrolledTooltip>
              </div>
            </div>
            <div className="modal-body-tabs__item">
              <div className="modal-tab-label">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
              </div>
              <TransactionStatus transaction={payment} />
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
                {isWithdraw && '-'}<Amount {...payment.amount} />
              </div>
            </div>
            <div className="modal-footer-tabs__item">
              <div className="modal-tab-label">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
              </div>
              <div>
                <div className="modal-footer-tabs__amount">
                  {payment.paymentMethod ? renderLabel(payment.paymentMethod, paymentsMethodsLabels) : 'Manual'}
                </div>
                {
                  !!payment.paymentAccount &&
                  <div className="font-size-14">
                    <PaymentAccount account={payment.paymentAccount} />
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="text-center">
            <NoteButton
              id="payment-detail-modal-note"
              note={payment.note}
              onClick={onNoteClick}
              targetEntity={payment}
            />
          </div>
        </ModalBody>

        {this.renderFooter()}
      </Modal>
    );
  }
}

export default PaymentDetailModal;
