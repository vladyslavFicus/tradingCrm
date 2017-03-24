import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import fileSize from 'filesize';
import PropTypes from '../../../../../../constants/propTypes';
import FileUpload from '../../../../../../components/FileUpload';
import { categories } from '../../../../../../constants/files';
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

  handleDeleteFileClick = (e, item) => {
    e.preventDefault();

    this.props.onCancelFile(item);
  };

  renderFileStatus = item => (
    <span>
      {
        !item.uploaded
          ? <span className="color-primary">Uploading - {item.progress}%</span>
          : (
          !item.error
            ? <span className="color-success">Uploaded</span>
            : <span className="color-danger">Failed</span>
        )
      }
      <span className="color-default">
          ({fileSize(item.file.size)})
        </span>
      {' '}
      <a href="#" onClick={e => this.handleDeleteFileClick(e, item)}>
        <i className="color-danger fa fa-trash" />
      </a>
    </span>
  );

  renderFile = (item, index) => (
    <tr key={item.id}>
      <td>{index + 1}</td>
      <td>{item.file.name}<br />{item.fileUUID}</td>
      <td>CATEGORY</td>
      <td>{this.renderFileStatus(item)}</td>
    </tr>
  );

  renderFiles = () => this.props.uploading.length
    ? (
      <table>
        <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Category</th>
          <th>Status</th>
          <th />
        </tr>
        </thead>
        <tbody>
        {this.props.uploading.map(this.renderFile)}
        </tbody>
      </table>
    )
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
        <ModalBody className="text-center">
          <p>
            <strong>You are about to upload file(s) to {profile.fullName}</strong> - {profile.shortUUID}
            {' '}
            <strong>account</strong>
          </p>

          <div className="margin-vertical-20">
            {this.renderFiles()}
          </div>
          <div className="row">
            <div className="col-md-12">
              <FileUpload
                label="+ Add files"
                allowedSize={5}
                allowedTypes={['image/jpeg', 'image/png']}
                onChosen={onUploadFile}
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
