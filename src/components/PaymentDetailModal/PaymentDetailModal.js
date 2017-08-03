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
import './PaymentDetailModal.scss';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import PermissionContent from '../PermissionContent';
import Permissions from '../../utils/permissions';
import permission from '../../config/permissions';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
import TransactionStatus from '../TransactionStatus';
import renderLabel from '../../utils/renderLabel';

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
    const { payment, playerProfile, onAskReason } = this.props;

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
    });
  };

  handleChargebackClick = () => {
    const { payment, playerProfile, onAskReason } = this.props;

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
    });
  };

  renderFooter = () => {
    const { onClose, payment: { status, paymentType } } = this.props;
    let actions = null;

    if (paymentType === paymentsTypes.Withdraw && status === paymentStatuses.PENDING) {
      actions = (
        <div>
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
        </div>
      );
    }

    if (paymentType === paymentsTypes.Deposit && status === paymentStatuses.COMPLETED) {
      actions = (
        <div>
          <PermissionContent permissions={chargebackCompletedDeposit}>
            <Button
              color="danger"
              onClick={this.handleChargebackClick}
            >
              Mark as chargeback
            </Button>
          </PermissionContent>
        </div>
      );
    }

    return (
      <ModalFooter className="payment-detail-footer">
        <Button onClick={onClose}>{I18n.t('COMMON.DEFER')}</Button>
        {
          actions &&
          <div className="payment-details-actions">
            {actions}
          </div>
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

          <div className="row payment-detail-blocks">
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
              </div>
              <div className="font-size-14">
                <div className="font-weight-700">
                  <Uuid uuid={payment.paymentId} uuidPrefix="TA" />
                </div>
                <span className="font-size-10 text-uppercase color-default">
                  {'by '}
                  <Uuid
                    uuid={payment.playerUUID}
                    uuidPrefix={payment.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
                  />
                </span>
              </div>
            </div>
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
              </div>
              <div>
                <div className="font-weight-700">
                  {moment(payment.creationTime).format('DD.MM.YYYY')}
                </div>
                <span className="font-size-10 color-default">
                  {moment(payment.creationTime).format('HH:mm')}
                </span>
              </div>
            </div>
            <div className="col-md-1 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Ip
              </div>
              {payment.country && <i className={`fs-icon fs-${payment.country.toLowerCase()}`} />}
            </div>
            <div className="col-md-2 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
              </div>
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
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
              </div>
              <TransactionStatus transaction={payment} />
            </div>
          </div>

          <div className="row well payment-detail-amount">
            <div className="payment-detail-amount-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}
              </div>
              <div
                className={classNames('font-size-16 font-weight-700', { 'color-danger': isWithdraw })}
              >
                {isWithdraw && '-'}<Amount {...payment.amount} />
              </div>
            </div>
            <div className="payment-detail-amount-block">
              <div className="color-default text-uppercase font-size-11">
                {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
              </div>
              <div>
                <div className="font-weight-700">
                  {payment.paymentMethod ? renderLabel(payment.paymentMethod, paymentsMethodsLabels) : 'Manual'}
                </div>
                <span className="font-size-10">
                  {shortify(payment.paymentAccount, null, 2)}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <NoteButton
                id="payment-detail-modal-note"
                note={payment.note}
                onClick={onNoteClick}
                targetEntity={payment}
              />
            </div>
          </div>
        </ModalBody>

        {this.renderFooter()}
      </Modal>
    );
  }
}

export default PaymentDetailModal;
