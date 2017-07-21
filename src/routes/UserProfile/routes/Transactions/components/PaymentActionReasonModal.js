import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';
import classNames from 'classnames';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import './PaymentDetailModal.scss';
import Uuid from '../../../../../components/Uuid';

class PaymentActionReasonModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    profile: PropTypes.userProfile,
    payment: PropTypes.paymentEntity,
    reasons: PropTypes.arrayOf(PropTypes.string),
    action: PropTypes.string.isRequired,
    modalStaticParams: PropTypes.paymentReasonModalStaticParams,
  };
  static defaultProps = {
    className: '',
    isOpen: false,
  };
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

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note);
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target);
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
      reasons,
      action,
      modalStaticParams,
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={onClose} className={classNames(this.props.className, 'payment-detail-modal')}>
        <ModalHeader toggle={onClose}>
          {modalStaticParams.title}
        </ModalHeader>

        <ModalBody>
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="font-weight-700">
                {modalStaticParams.actionDescription}
              </div>
              <div className="font-weight-400">
                <span className="font-weight-700">{firstName} {lastName} </span>
                <Uuid uuid={playerUUID} uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="color-default text-uppercase font-size-11">
                Reason
              </div>
              <Input type="select" onChange={this.selectReason} value={this.state.selectedReason}>
                {reasons.map((reason, i) => <option key={i}>{reason}</option>)}
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
                note={note}
                onClick={this.handleNoteClick}
                targetEntity={this.props.payment}
              />
            </div>
          </div>

        </ModalBody>

        <ModalFooter className="payment-detail-footer">
          <Button onClick={onClose}>Defer</Button>
          <div className="payment-details-actions">
            <Button
              disabled={this.state.reason.length === 0 || this.state.reason.length > 500}
              color="danger"
              onClick={() => onChangePaymentStatus(action, playerUUID, paymentId, {
                reason: this.state.reason,
                fraud: false,
              })}
            >{modalStaticParams.actionButtonLabel}</Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PaymentActionReasonModal;
