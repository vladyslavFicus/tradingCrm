import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';

class ConfirmActionModal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    fullName: PropTypes.string,
    uuid: PropTypes.string,
    additionalText: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onCloseCallback: PropTypes.func,
  };

  static defaultProps = {
    modalTitle: 'Confirm action',
    actionText: 'Do you really want to confirm this action?',
    submitButtonLabel: I18n.t('COMMON.BUTTONS.CONFIRM'),
    fullName: '',
    uuid: null,
    additionalText: null,
    onCloseCallback: () => {},
  };

  handleClose = () => {
    const { onCloseModal, onCloseCallback } = this.props;

    onCloseModal();
    onCloseCallback();
  };

  onSubmit = () => {
    const { onSubmit, onCloseCallback } = this.props;

    onSubmit();
    onCloseCallback();
  }

  render() {
    const {
      modalTitle,
      actionText,
      fullName,
      uuid,
      submitButtonLabel,
      additionalText,
      isOpen,
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={this.handleClose} className="modal-danger">
        <ModalHeader toggle={this.handleClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="text-center font-weight-700">
            <div>{actionText}</div>
            <div>
              {`${fullName}${fullName && uuid ? ' - ' : ''}`}
              {uuid && <span className="font-weight-400">{shortify(uuid)}</span>}
              {additionalText && <span className="margin-left-5">{additionalText}</span>}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={this.handleClose}
            className="btn btn-default-outline mr-auto"
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger-outline"
            onClick={this.onSubmit}
          >
            {submitButtonLabel}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmActionModal;
