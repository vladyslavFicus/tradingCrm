import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../../../components/Uuid';
import PropTypes from '../../../../../../constants/propTypes';

class SimpleConfirmationModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
  };
  static defaultProps = {
    handleSubmit: null,
    className: 'modal-danger',
    modalTitle: 'KYC - verification',
    actionText: 'You are about to verify player',
    submitButtonLabel: 'verify',
  };

  render() {
    const {
      profile: { playerUUID },
      onSubmit,
      handleSubmit,
      onClose,
      className,
      modalTitle,
      actionText,
      submitButtonLabel,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
          <ModalBody>
            <div className="text-center center-block width-300">
              <strong> {actionText} </strong>
              {' - '}
              <Uuid uuid={playerUUID} uuidPrefix="PL" />
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

export default reduxForm()(SimpleConfirmationModal);
