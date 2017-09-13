import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import Uuid from '../../components/Uuid';

class ConfirmActionModal extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    form: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    uuidPrefix: PropTypes.string,
  };
  static defaultProps = {
    handleSubmit: null,
    className: 'modal-danger',
    modalTitle: 'Confirm action',
    actionText: 'Do you really want to confirm this action?',
    submitButtonLabel: 'Confirm',
    uuid: null,
    uuidPrefix: 'PL',
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      onClose,
      className,
      modalTitle,
      actionText,
      uuid,
      uuidPrefix,
      submitButtonLabel,
      form,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
          <ModalBody>
            <div className="text-center center-block width-300">
              <strong>{actionText}</strong>
              {uuid && <Uuid uuid={uuid} uuidPrefix={uuidPrefix} />}
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              onClick={onClose}
              className="btn btn-default-outline pull-left"
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            {' '}
            <button
              type="submit"
              className="btn btn-danger-outline"
            >
              {submitButtonLabel}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm()(ConfirmActionModal);
