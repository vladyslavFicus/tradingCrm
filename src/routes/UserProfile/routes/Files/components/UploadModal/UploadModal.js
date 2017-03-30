import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from '../../../../../../constants/propTypes';
import FileUpload from '../../../../../../components/FileUpload';
import { categories } from '../../../../../../constants/files';
import UploadingFile from '../UploadingFile';
import './UploadModal.scss';

class UploadModal extends Component {
  static propTypes = {
    profile: PropTypes.object,
    uploading: PropTypes.arrayOf(PropTypes.uploadingFile).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func.isRequired,
    onCancelFile: PropTypes.func.isRequired,
  };

  handleSubmit = () => {
    this.props.onSubmit(this.props.uploading.reduce((result, item) => ({
      ...result,
      [item.fileUUID]: { name: item.file.name, category: categories.OTHER },
    }), {}));
  };

  renderFile = (item, index) => (
    <UploadingFile
      number={index + 1}
      data={item}
      onCancelClick={this.props.onCancelFile}
    />
  );

  renderFilesTable = () => {
    return (
      <table className="uploading-files">
        <thead>
        <tr>
          <th className="uploading-files__header-number" />
          <th className="uploading-files__header-name">Name</th>
          <th className="uploading-files__header-category">Category</th>
          <th className="uploading-files__header-status">Status</th>
          <th className="uploading-files__header-note" />
        </tr>
        </thead>
        <tbody>
        {this.props.uploading.map(this.renderFile)}
        </tbody>
      </table>
    );
  };

  renderFiles = () => this.props.uploading.length
    ? this.renderFilesTable()
    : <span className="text-muted font-size-12">There are no uploaded files</span>;

  render() {
    const {
      profile,
      onClose,
      onSubmit,
      uploading,
      onUploadFile,
      onCancelFile,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} className="upload-modal" toggle={onClose}>
        <ModalHeader toggle={onClose}>File upload</ModalHeader>
        <ModalBody>
          <div className="text-center">
            <strong>You are about to upload file(s) to {profile.fullName}</strong> - {profile.shortUUID}
            {' '}
            <strong>account</strong>
          </div>

          <div className="margin-vertical-20">
            {this.renderFiles()}
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <FileUpload
                label="+ Add files"
                allowedSize={2}
                allowedTypes={['image/jpeg', 'image/png']}
                onChosen={onUploadFile}
                singleMode={false}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-md-6">
              <Button color="secondary" className="text-uppercase" onClick={onClose}>
                Cancel
              </Button>
            </div>
            <div className="col-md-6 text-right">
              <Button color="primary" className="text-uppercase" onClick={this.handleSubmit}>
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
