import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';

class ConfirmActionModal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    fullName: PropTypes.string,
    uuid: PropTypes.string,
  };
  static defaultProps = {
    modalTitle: 'Confirm action',
    actionText: 'Do you really want to confirm this action?',
    submitButtonLabel: I18n.t('COMMON.BUTTONS.CONFIRM'),
    fullName: null,
    uuid: null,
  };

  render() {
    const {
      onSubmit,
      onClose,
      modalTitle,
      actionText,
      fullName,
      uuid,
      submitButtonLabel,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose} className="modal-danger">
        <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="text-center font-weight-700">
            <div>{actionText}</div>
            <div>
              {`${fullName}${fullName && uuid ? ' - ' : ''}`}
              {uuid && <span className="font-weight-400">{shortify(uuid)}</span>}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            onClick={onClose}
            className="btn btn-default-outline pull-left"
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-danger-outline"
            onClick={onSubmit}
          >
            {submitButtonLabel}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmActionModal;
