import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from '../../../../../../constants/propTypes';
import './DeleteModal.scss';

class DeleteModal extends Component {
  static propTypes = {
    file: PropTypes.fileEntity.isRequired,
    profile: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const {
      profile,
      file,
      onSuccess,
      onClose,
      ...rest,
    } = this.props;

    return (
      <Modal {...rest} className="delete-modal" toggle={onClose}>
        <ModalHeader toggle={onClose}>Delete file - Confirmation</ModalHeader>
        <ModalBody className="text-center">
          <div className="margin-bottom-20">
            <strong>You are about to delete file {file.name} from {profile.fullName}</strong> - {profile.shortUUID}
            {' '}
            <strong>account</strong>
          </div>

          <div className="margin-bottom-20">
            This action can not be undone!
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-md-6">
              <button className="btn btn-default-outline text-uppercase" onClick={onClose}>
                Cancel
              </button>
            </div>
            <div className="col-md-6 text-right">
              <button className="btn btn-danger text-uppercase" onClick={onSuccess}>
                Delete File
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DeleteModal;
