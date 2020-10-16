import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { shortify } from 'utils/uuid';
import { Button } from 'components/UI';

class ConfirmActionModal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
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
    cancelButtonLabel: I18n.t('COMMON.CANCEL'),
    fullName: '',
    uuid: null,
    additionalText: null,
    onCloseCallback: () => {},
  };

  state = {
    isSubmitting: false,
  }

  handleClose = () => {
    const { onCloseModal, onCloseCallback } = this.props;

    onCloseModal();
    onCloseCallback();
  };

  onSubmit = async () => {
    const { onSubmit, onCloseCallback } = this.props;
    const { isSubmitting } = this.state;

    if (!isSubmitting) {
      this.setState({ isSubmitting: true });

      await onSubmit();
      await onCloseCallback();

      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const {
      modalTitle,
      actionText,
      fullName,
      uuid,
      submitButtonLabel,
      cancelButtonLabel,
      additionalText,
      isOpen,
    } = this.props;

    const { isSubmitting } = this.state;

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
          <Button
            commonOutline
            className="mr-auto"
            onClick={this.handleClose}
          >
            {cancelButtonLabel}
          </Button>
          <Button
            type="submit"
            dangerOutline
            disabled={isSubmitting}
            onClick={this.onSubmit}
          >
            {submitButtonLabel}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmActionModal;
