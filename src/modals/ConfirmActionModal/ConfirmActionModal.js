import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { shortify } from 'utils/uuid';
import './ConfirmActionModal.scss';

class ConfirmActionModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string,
    fullName: PropTypes.string,
    actionText: PropTypes.string,
    modalTitle: PropTypes.string,
    additionalText: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    submitButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onCloseModal: PropTypes.func.isRequired,
    onCloseCallback: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    uuid: null,
    fullName: '',
    additionalText: null,
    onCloseCallback: () => {},
    onCancel: () => {},
    modalTitle: I18n.t('MODALS.CONFIRM_ACTION_MODAL.TITLE'),
    actionText: I18n.t('MODALS.CONFIRM_ACTION_MODAL.DESCRIPTION'),
    submitButtonLabel: I18n.t('COMMON.BUTTONS.CONFIRM'),
    cancelButtonLabel: I18n.t('COMMON.CANCEL'),
    className: null,
  };

  state = {
    isSubmitting: false,
  };

  handleClose = async () => {
    const { onCloseModal, onCloseCallback, onCancel } = this.props;

    await onCancel();
    await onCloseModal();
    await onCloseCallback();
  }

  handleSubmit = async () => {
    const { onSubmit, onCloseCallback, onCloseModal } = this.props;
    const { isSubmitting } = this.state;

    if (!isSubmitting) {
      this.setState({ isSubmitting: true });

      await onSubmit();
      await onCloseCallback();
      await onCloseModal();

      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const {
      uuid,
      isOpen,
      fullName,
      actionText,
      modalTitle,
      additionalText,
      submitButtonLabel,
      cancelButtonLabel,
      className,
    } = this.props;

    const { isSubmitting } = this.state;

    return (
      <Modal
        className={classNames('ConfirmActionModal modal-danger', className)}
        isOpen={isOpen}
        toggle={this.handleClose}
      >
        <ModalHeader toggle={this.handleClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="ConfirmActionModal__row ConfirmActionModal__action-text">{actionText}</div>
          <div className="ConfirmActionModal__row">
            <If condition={fullName}>
              <span className="ConfirmActionModal__fullname">{fullName}</span>
            </If>

            <If condition={fullName && uuid}>
              <b> - </b>
            </If>

            <If condition={uuid}>
              <span className="ConfirmActionModal__uuid">{shortify(uuid)}</span>
            </If>

            <If condition={additionalText}>
              <span className="ConfirmActionModal__additional-text">{additionalText}</span>
            </If>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            commonOutline
            onClick={this.handleClose}
          >
            {cancelButtonLabel}
          </Button>
          <Button
            autoFocus
            dangerOutline
            type="submit"
            disabled={isSubmitting}
            onClick={this.handleSubmit}
          >
            {submitButtonLabel}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmActionModal;
