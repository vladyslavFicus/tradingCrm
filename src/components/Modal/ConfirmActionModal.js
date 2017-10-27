import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';
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

    const playerInfo = [];
    if (fullName) {
      playerInfo.push(fullName);
    }
    if (uuid) {
      playerInfo.push(ReactDOM.renderToString(<span className="font-weight-400">{shortify(uuid)}</span>));
    }
    return (
      <Modal isOpen toggle={onClose} className="modal-danger">
        <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
        <ModalBody>
          <div className="text-center margin-bottom-20 font-weight-700">
            <div>{actionText}</div>
            <div dangerouslySetInnerHTML={{ __html: playerInfo.join(' - ') }} />
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
