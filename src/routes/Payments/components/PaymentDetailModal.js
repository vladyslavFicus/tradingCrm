import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import {
  methodsLabels as paymentsMethodsLabels,
  statusesLabels as paymentsStatusesLabels,
  statusesColor as paymentsStatusesColor,
  types as paymentsTypes,
} from 'constants/payment';
import { statusColorNames } from 'constants/user';
import { targetTypes } from 'constants/note';
import Amount from 'components/Amount';
import NoteButton from 'components/NoteButton';
import { shortify } from 'utils/uuid';
import './PaymentDetailModal.scss';
import { UncontrolledTooltip } from '../../../components/Reactstrap/Uncontrolled';

class PaymentDetailModal extends Component {
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  getNotePopoverParams = () => ({
    placement: 'top',
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, this.getNotePopoverParams());
    }
  };

  render() {
    const {
      payment: {
        paymentType,
        paymentMethod,
        paymentAccount,
        status,
        paymentId,
        amount,
        playerUUID,
        creationTime,
        country,
        mobile,
        note,
        userAgent,
      },
      profile: {
        firstName,
        lastName,
        birthDate,
        username,
        languageCode,
        uuid,
        profileStatus,
        suspendEndDate,
        balance,
      },
      accumulatedBalances: { real, bonus },
      isOpen,
      onClose,
      onChangePaymentStatus,
      onAboutToReject,
    } = this.props;

    return <Modal isOpen={isOpen} toggle={onClose} className={classNames(this.props.className, 'payment-detail-modal')}>
      <ModalHeader toggle={onClose}>Payment details</ModalHeader>

      <ModalBody>
        <div className="row payment-detail-player">
          <div className="col-md-4 payment-detail-player-block">
            <div className="color-default text-uppercase font-size-11">
              Player
            </div>
            <div className="font-size-14">
              <div className="font-weight-700">
                {firstName} {lastName}
                <span className="font-weight-400"> {birthDate ? `(${moment().diff(birthDate, 'years')})` : null}</span>
              </div>
              <span className="font-size-10 text-uppercase color-default">
                {[username, shortify(uuid, 'PL'), languageCode].join(' - ')}
              </span>
            </div>
          </div>
          <div className="col-md-4 payment-detail-player-block">
            <div className="color-default text-uppercase font-size-11">
              Account Status
            </div>
            <div className="font-size-14">
              <div className="font-weight-700">
                <div className={` ${statusColorNames[profileStatus]}`}>{profileStatus}</div>
                  {!!suspendEndDate && <span className="font-size-10 text-uppercase color-default">
                    Until {moment(suspendEndDate).format('L')}
                  </span>}
              </div>
            </div>
          </div>
          <div className="col-md-4 payment-detail-player-block">
            <div className="color-default text-uppercase font-size-11">
              Balance
            </div>
            <div className="font-size-14">
              <div className="font-weight-700">
                <Amount { ...balance } />
              </div>
              <span className="font-size-10 text-uppercase color-default">
                RM <Amount { ...real } /> + BM <Amount { ...bonus } />
              </span>
            </div>
          </div>
        </div>

        <div className="row payment-detail-blocks">
          <div className="col-md-3 payment-detail-block">
            <div className="color-default text-uppercase font-size-11">
              Transaction
            </div>
            <div className="font-size-14">
              <div className="font-weight-700">{shortify(paymentId, 'TA')}</div>
              <span className="font-size-10 text-uppercase color-default">
                by {shortify(playerUUID, 'PL')}
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
            {country && <i className={`fs-icon fs-${country.toLowerCase()}`}/>}
          </div>
          <div className="col-md-2 payment-detail-block">
            <div className="color-default text-uppercase font-size-11">
              Device
            </div>
            <i
              id={`${paymentId}-popup`}
              className={`fa font-size-20 ${mobile ? 'fa-mobile' : 'fa-desktop'}`}
            />
            <UncontrolledTooltip
              placement="bottom"
              target={`${paymentId}-popup`}
              delay={{
                show: 350, hide: 250,
              }}
            >
              {userAgent ? userAgent : 'User agent not defined'}
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
              <span className="font-size-10 color-default">
                {moment(creationTime).format('DD.MM.YYYY \- HH:mm')}
              </span>
            </div>
          </div>
        </div>

        <div className="row well payment-detail-amount">
          <div className="payment-detail-amount-block">
            <div className="color-default text-uppercase font-size-11">
              Amount
            </div>
            <div className={classNames('font-size-16 font-weight-700', { 'color-danger': paymentType === paymentsTypes.Withdraw })}>
              {paymentType === paymentsTypes.Withdraw && '-'}<Amount {...amount} />
            </div>
          </div>
          <div className="payment-detail-amount-block">
            <div className="color-default text-uppercase font-size-11">
              Payment Method
            </div>
            <div>
              <div className="font-weight-700">
                { paymentsMethodsLabels[paymentMethod] || paymentMethod }
              </div>
              <span className="font-size-10">
                { shortify(paymentAccount, null, 2) }
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <NoteButton
              id="payment-detail-modal-note"
              className="cursor-pointer margin-right-5"
              onClick={(id) => this.handleNoteClick(id, this.props.payment)}
            >
              {note
                ? <i className="fa fa-sticky-note" />
                : <i className="fa fa-sticky-note-o" />
              }
            </NoteButton>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="payment-detail-footer">
        <Button onClick={onClose}>Defer</Button>
        <div className="payment-details-actions">
          <Button color="primary"
                  onClick={(e) => onChangePaymentStatus('approve', paymentId)}>Approve</Button>{' '}
          <Button color="danger" onClick={(e) => onAboutToReject(e, this.props.payment)}>Reject</Button>
        </div>
      </ModalFooter>
    </Modal>;
  }
}

PaymentDetailModal.propTypes = {
  payment: PropTypes.shape({
    paymentId: PropTypes.string,
    transactions: PropTypes.array,
  }),
  onAboutToReject: PropTypes.func,
};

export default PaymentDetailModal;
