import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from '../../../../../../constants/propTypes';
import FileUpload from '../../../../../../components/FileUpload';
import { categories } from '../../../../../../constants/files';
import { createValidator } from '../../../../../../utils/validator';
import UploadingFile from '../UploadingFile';
import './UploadModal.scss';

const FORM_NAME = 'userUploadModal';
const attributeLabels = {
  title: 'File title',
  category: 'Choose category',
};
const validator = createValidator({
  title: ['required', 'string', 'min:3'],
  category: ['required', 'string', `in:${Object.keys(categories).join()}`],
}, attributeLabels, false);

const validate = (data) => {
  if (!data) {
    return {};
  }

  return Object.keys(data).reduce((res, file) => ({ ...res, [file]: validator(data[file]) }), {});
};

class UploadModal extends Component {
  static propTypes = {
    profile: PropTypes.object,
    uploading: PropTypes.arrayOf(PropTypes.uploadingFile).isRequired,
    invalid: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func.isRequired,
    onCancelFile: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
  };

  handleSubmit = (data) => {
    const result = this.props.uploading.reduce((res, file) => ({
      ...res,
      [file.fileUUID]: data[file.id],
    }), {});

    return this.props.onSubmit(result);
  };

  renderFile = (item, index) => (
    <UploadingFile
      key={item.id}
      number={index + 1}
      data={item}
      onCancelClick={this.props.onCancelFile}
      onManageNote={this.props.onManageNote}
    />
  );

  renderFilesTable = () => (
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

  renderFiles = () => this.props.uploading.length
    ? this.renderFilesTable()
    : (
      <div className="text-center">
        <span className="text-muted font-size-12">There are no uploaded files</span>
      </div>
    );

  render() {
    const {
      profile,
      onClose,
      uploading,
      invalid,
      submitting,
      handleSubmit,
      onUploadFile,
    } = this.props;

    return (
      <Modal isOpen keyboard={false} backdrop="static" className="upload-modal" toggle={onClose}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
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
                <button
                  type="reset"
                  disabled={submitting || uploading.some(i => i.uploading)}
                  className="btn btn-default-outline text-uppercase"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button
                  disabled={submitting || invalid || uploading.length === 0 || uploading.some(i => i.uploading)}
                  className="btn btn-primary text-uppercase"
                >
                  Confirm
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate,
})(UploadModal);
