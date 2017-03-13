import React, { Component, PropTypes } from 'react';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';

import classNames from 'classnames';
import { statusColorNames } from 'constants/user';
import { targetTypes } from 'constants/note';

// TODO: move NoteButton to top components
import NoteButton from '../../../routes/UserProfile/components/NoteButton';

import './PaymentDetailModal.scss';

import { shortify } from 'utils/uuid';

class PaymentRejectModal extends Component {

  state = {
    dropdownOpen: false,
    selectedReason: "Reason 1",
    isOtherReason: false,
    reason: ""
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  getNotePopoverParams = () => ({
    placement: 'left'
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, this.getNotePopoverParams());
    }
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  selectReason = (e) => {
    this.setState({
      selectedReason: e.target.value,
      isOtherReason: e.target.value === "Other",
      reason: e.target.value === "Other" ? "" : e.target.value,
    });
  };

  changeReason = (e) => {
    this.setState({
      reason: e.target.value
    });
  };

  render() {
    const {
      payment: {
        paymentId,
        playerUUID,
        note
      },
      profile: {
        firstName,
        lastName,
      },
      isOpen,
      onClose,
      onChangePaymentStatus,
      rejectReasons,
    } = this.props;

    return <Modal isOpen={isOpen} toggle={onClose} className={classNames(this.props.className, "payment-detail-modal")}>
      <ModalHeader toggle={onClose}>Withdrawal rejection</ModalHeader>

      <ModalBody>
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="font-weight-700">
              You are about to reject withdraw transaction {shortify(paymentId, 'TA')}
            </div>
            <div className="font-weight-400">
              from <span className="font-weight-700">{firstName} {lastName} </span>{shortify(playerUUID, 'PL')}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="color-default text-uppercase font-size-11">
              Reason
            </div>
            <Input type="select" onChange={this.selectReason} value={this.state.selectedReason}>
              {rejectReasons.map((reason, i) => <option key={i}>{reason}</option>)}
              <option>Other</option>
            </Input>
            {this.state.isOtherReason
              && <Input type="textarea" onChange={this.changeReason} value={this.state.reason}/>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <NoteButton
              id={`bonus-item-note-button-${paymentId}`}
              className="cursor-pointer margin-right-5"
              onClick={(id) => this.handleNoteClick(id, {note})}
            >
              {note
                ? <i className="fa fa-sticky-note"/>
                : <i className="fa fa-sticky-note-o"/>
              }
            </NoteButton>
          </div>
        </div>

      </ModalBody>

      <ModalFooter className="payment-detail-footer">
        <Button onClick={onClose}>Defer</Button>
        <div className="payment-details-actions">
          <Button color="danger" onClick={(e) => onChangePaymentStatus('refuse', paymentId, {
            playerUUID,
            reason: this.state.reason,
            fraud: false,
          })}>Reject withdraw transaction</Button>
        </div>
      </ModalFooter>
    </Modal>;
  }
}

PaymentRejectModal.propTypes = {
  payment: PropTypes.shape({
    paymentId: PropTypes.string,
    transactions: PropTypes.array,
  }),
  onAboutToReject: PropTypes.func,
  rejectReasons: PropTypes.array,
};

export default PaymentRejectModal;
