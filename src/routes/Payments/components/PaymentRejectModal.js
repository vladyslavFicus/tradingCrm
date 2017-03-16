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
import NoteButton from '../../../routes/UserProfile/components/NoteButton';
import './PaymentDetailModal.scss';
import { shortify } from 'utils/uuid';

class PaymentRejectModal extends Component {
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    dropDownOpen: false,
    selectedReason: 'Reason 1',
    isOtherReason: false,
    reason: 'Reason 1',
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

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  selectReason = (e) => {
    this.setState({
      selectedReason: e.target.value,
      isOtherReason: e.target.value === 'Other',
      reason: e.target.value === 'Other' ? '' : e.target.value,
    });
  };

  changeReason = (e) => {
    this.setState({
      reason: e.target.value,
    });
  };

  render() {
    const {
      payment: {
        paymentId,
        playerUUID,
        note,
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

    return (
      <Modal
        isOpen={isOpen} toggle={onClose} className={classNames(this.props.className, 'payment-detail-modal')}
      >
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
              && <div>
                <Input type="textarea" onChange={this.changeReason} value={this.state.reason} />
                <div className="color-default text-uppercase font-size-11">
                  {this.state.reason.length}/500
                </div>
              </div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 text-center">
              <NoteButton
                id="payment-reject-modal-note"
                className="cursor-pointer margin-right-5"
                onClick={id => this.handleNoteClick(id, this.props.payment)}
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
            <Button
              disabled={this.state.reason.length === 0 || this.state.reason.length > 500}
              color="danger"
              onClick={() => onChangePaymentStatus('refuse', paymentId, {
                playerUUID,
                reason: this.state.reason,
                fraud: false,
              })}
            >Reject withdraw transaction</Button>
          </div>
        </ModalFooter>
      </Modal>);
  }
}

PaymentRejectModal.propTypes = {
  payment: PropTypes.object,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  rejectReasons: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onChangePaymentStatus: PropTypes.func,
  className: PropTypes.string,
};

export default PaymentRejectModal;
