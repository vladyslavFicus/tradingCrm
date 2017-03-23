import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class UploadModal extends Component {
  static propTypes = {
    profile,
    onClose,
    onSubmit,
  };

  render() {
    const {
      profile,
      onHide,
      onSubmit,
    } = this.props;

    return (
      <Modal toggle={onClose}>
        <ModalHeader toggle={onClose}>File upload</ModalHeader>
        <ModalBody>
          <p>You are about to upload file(s) to {profile.fullName} - ${profile.shortPlayerUUID} account</p>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-md-6">
              <Button color="secondary" className="text-uppercase" onClick={this.onClose}>
                Cancel
              </Button>
            </div>
            <div className="col-md-6">
              <Button color="primary" className="text-uppercase" onClick={this.onSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default UploadModal;
