import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

class NotificationModal extends Component {
  static propTypes = {
    onSubmitModal: PropTypes.func,
    onCloseModal: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    modalTitle: 'Notification',
    actionText: 'This is notification message',
    submitButtonLabel: 'Ok',
    onSubmitModal: () => {},
  };

  handleCloseModal = () => {
    const { onCloseModal, onSubmitModal } = this.props;

    onSubmitModal();
    onCloseModal();
  }

  render() {
    const {
      isOpen,
      modalTitle,
      actionText,
      submitButtonLabel,
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={this.handleCloseModal}>
        <ModalHeader toggle={this.handleCloseModal}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="text-center font-weight-700">{actionText}</div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary-outline"
            onClick={this.handleCloseModal}
          >
            {submitButtonLabel}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default NotificationModal;
