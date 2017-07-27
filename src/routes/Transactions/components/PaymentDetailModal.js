import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import {
  methodsLabels as paymentsMethodsLabels,
  statusesLabels as paymentsStatusesLabels,
  statusesColor as paymentsStatusesColor,
  types as paymentsTypes,
  paymentActions,
} from '../../../constants/payment';
import { targetTypes } from '../../../constants/note';
import Amount from '../../../components/Amount';
import NoteButton from '../../../components/NoteButton';
import { shortify } from '../../../utils/uuid';
import './PaymentDetailModal.scss';
import { UncontrolledTooltip } from '../../../components/Reactstrap/Uncontrolled';
import PermissionContent from '../../../components/PermissionContent';
import Permissions from '../../../utils/permissions';
import permission from '../../../config/permissions';
import Uuid from '../../../components/Uuid';
import ModalPlayerInfo from '../../../components/ModalPlayerInfo';

const approvePendingWithdraw = new Permissions([permission.PAYMENTS.APPROVE_WITHDRAW]);
const chargebackCompletedDeposit = new Permissions([permission.PAYMENTS.CHARGEBACK_DEPOSIT]);

class PaymentDetailModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    onAskReason: PropTypes.func.isRequired,
    payment: PropTypes.paymentEntity.isRequired,
    playerProfile: PropTypes.userProfile.isRequired,
  };
  static defaultProps = {
    className: '',
    isOpen: false,
    profile: null,
  };
  static contextTypes = {
    notes: PropTypes.shape({
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
    }),
  };

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.notes.onEditNoteClick(target, note, { placement: 'top' });
    } else {
      this.context.notes.onAddNoteClick(target, {
        playerUUID: data.playerUUID,
        targetUUID: data.paymentId,
        targetType: targetTypes.PAYMENT,
      }, { placement: 'top' });
    }
  };

  handleApproveClick = () => {
    const { payment: { paymentId, playerUUID }, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus(paymentActions.APPROVE, playerUUID, paymentId);
  };

  handleRejectClick = () => {
    const { payment, playerProfile, onAskReason } = this.props;

    return onAskReason({
      payment,
      playerProfile,
      action: paymentActions.REJECT,
      modalStaticParams: {
        title: 'Withdrawal rejection',
        actionButtonLabel: 'Reject withdraw transaction',
        actionDescription: `You are about to reject withdraw transaction ${shortify(payment.paymentId, 'TA')} from`,
      },
    });
  };

  handleChargebackClick = () => {
    const { payment, playerProfile, onAskReason } = this.props;

    return onAskReason({
      payment,
      playerProfile,
      action: paymentActions.CHARGEBACK,
      modalStaticParams: {
        actionButtonLabel: 'Confirm',
        title: 'Deposit chargeback',
        actionDescription: `You are about to mark the deposit transaction ${shortify(payment.paymentId, 'TA')} as chargeback in`,
      },
    });
  };

  renderFooter = () => {
    const { onClose, payment: { paymentType } } = this.props;

    let actions = null;
    if (paymentType === paymentsTypes.Withdraw) {
      actions = (
        <div>
          <PermissionContent permissions={approvePendingWithdraw}>
            <Button
              color="primary"
              onClick={this.handleApproveClick}
            >
              Approve
            </Button>
          </PermissionContent>
          <Button
            color="danger"
            onClick={this.handleRejectClick}
          >
            Reject
          </Button>
        </div>
      );
    }

    if (paymentType === paymentsTypes.Deposit) {
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
        <Button onClick={onClose}>Defer</Button>
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
      payment: {
        paymentType,
        paymentMethod,
        paymentAccount,
        status,
        paymentId,
        creatorUUID,
        amount,
        playerUUID,
        creationTime,
        country,
        mobile,
        note,
        userAgent,
      },
      playerProfile,
      isOpen,
      onClose,
      className,
    } = this.props;
    const isWithdraw = paymentType === paymentsTypes.Withdraw;

    return (
      <Modal isOpen={isOpen} toggle={onClose} className={classNames(className, 'payment-detail-modal')}>
        <ModalHeader toggle={onClose}>Payment details</ModalHeader>

        <ModalBody>
          <ModalPlayerInfo playerProfile={playerProfile} />

          <div className="row payment-detail-blocks">
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Transaction
              </div>
              <div className="font-size-14">
                <div className="font-weight-700">
                  <Uuid uuid={paymentId} uuidPrefix="TA" />
                </div>
                <span className="font-size-10 text-uppercase color-default">
                by <Uuid uuid={playerUUID} uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />
                </span>
              </div>
            </div>
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Date and Time
              </div>
              <div>
                <div className="font-weight-700">
                  {moment(creationTime).format('DD.MM.YYYY')}
                </div>
                <span className="font-size-10 color-default">
                  {moment(creationTime).format('HH:mm')}
                </span>
              </div>
            </div>
            <div className="col-md-1 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Ip
              </div>
              {country && <i className={`fs-icon fs-${country.toLowerCase()}`} />}
            </div>
            <div className="col-md-2 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Device
              </div>
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
            <div className="col-md-3 payment-detail-block">
              <div className="color-default text-uppercase font-size-11">
                Status
              </div>
              <div>
                <div className={classNames(paymentsStatusesColor[status], 'font-weight-700', 'text-uppercase')}>
                  {paymentsStatusesLabels[status] || status}
                </div>
                {
                  creatorUUID &&
                  <div className="font-size-10 color-default">
                    {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={creatorUUID} />
                  </div>
                }
                <span className="font-size-10 color-default">
                  {moment(creationTime).format('DD.MM.YYYY - HH:mm')}
                </span>
              </div>
            </div>
          </div>

          <div className="row well payment-detail-amount">
            <div className="payment-detail-amount-block">
              <div className="color-default text-uppercase font-size-11">
                Amount
              </div>
              <div
                className={classNames('font-size-16 font-weight-700', { 'color-danger': isWithdraw })}
              >
                {isWithdraw && '-'}<Amount {...amount} />
              </div>
            </div>
            <div className="payment-detail-amount-block">
              <div className="color-default text-uppercase font-size-11">
                Payment Method
              </div>
              <div>
                <div className="font-weight-700">
                  {paymentsMethodsLabels[paymentMethod] || 'Manual'}
                </div>
                <span className="font-size-10">
                  {shortify(paymentAccount, null, 2)}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <NoteButton
                id="payment-detail-modal-note"
                note={note}
                onClick={this.handleNoteClick}
                targetEntity={this.props.payment}
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
