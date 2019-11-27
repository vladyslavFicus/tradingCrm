import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from '../../../constants/propTypes';
import FileUpload from '../../FileUpload';
import { categories } from '../../../constants/files';
import { createValidator, translateLabels } from '../../../utils/validator';
import UploadingFile from '../UploadingFile';
import { targetTypes } from '../constants';
import { shortify } from '../../../utils/uuid';
import attributeLabels from './constants';

class UploadModal extends Component {
  static propTypes = {
    profile: PropTypes.object,
    uploading: PropTypes.arrayOf(PropTypes.uploadingFile).isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancelFile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    targetType: PropTypes.string.isRequired,
    fileInitialValues: PropTypes.object,
    targetUuid: PropTypes.string,
    maxFileSize: PropTypes.number,
    allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    maxFileSize: 2,
    allowedFileTypes: ['image/jpeg', 'image/png'],
    profile: null,
    fileInitialValues: null,
    targetUuid: null,
  };

  handleSubmit = (data) => {
    const { uploading, fileInitialValues } = this.props;
    const result = uploading.reduce((res, file) => ({
      ...res,
      [file.fileUUID]: {
        ...data[file.id],
        ...fileInitialValues,
      },
    }), {});

    return this.props.onSubmit(result);
  };

  handleUploadFile = (errors, files) => {
    Object.keys(files)
      .forEach(index => this.props.uploadFile(files[index], errors[index], this.props.targetUuid));
  };

  renderFile = (item, index) => (
    <UploadingFile
      key={item.id}
      number={index + 1}
      data={item}
      onCancelClick={this.props.onCancelFile}
      targetType={this.props.targetType}
      playerUUID={this.props.profile.playerUUID}
    />
  );

  renderFilesTable = () => (
    <table className="uploading-files">
      <thead>
        <tr>
          <th className="uploading-files__header-number" />
          <th className="uploading-files__header-name">
            {I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE')}
          </th>
          {
            this.props.targetType === targetTypes.FILES
            && (
              <th className="uploading-files__header-category">
                {I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY')}
              </th>
            )
          }
          <th className="uploading-files__header-status">
            {I18n.t('FILES.UPLOAD_MODAL.FILE.STATUS')}
          </th>
          <th className="uploading-files__header-note" />
        </tr>
      </thead>
      <tbody>
        {this.props.uploading.map(this.renderFile)}
      </tbody>
    </table>
  );

  renderFiles = () => (
    <Choose>
      <When condition={this.props.uploading.length}>
        {this.renderFilesTable()}
      </When>
      <Otherwise>
        <div className="text-center text-muted font-size-12">
          {I18n.t('FILES.UPLOAD_MODAL.NO_UPLOADED')}
        </div>
      </Otherwise>
    </Choose>
  );

  render() {
    const {
      profile: {
        firstName,
        lastName,
        playerUUID,
      },
      onClose,
      uploading,
      submitting,
      handleSubmit,
      maxFileSize,
      allowedFileTypes,
    } = this.props;

    const fullName = `${firstName} ${lastName}`;

    return (
      <Modal isOpen keyboard={false} backdrop="static" className="upload-modal" toggle={onClose}>
        <ModalHeader toggle={onClose}>
          {I18n.t('FILES.UPLOAD_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody tag="form" id="upload-modal-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div
            className="text-center font-weight-700"
            dangerouslySetInnerHTML={{
              __html: I18n.t('FILES.UPLOAD_MODAL.ACTION_TEXT', {
                fullName,
                shortUUID: `<span class="font-weight-400">${shortify(playerUUID)}</span>`,
              }),
            }}
          />
          <div className="my-4">
            {this.renderFiles()}
          </div>
          <div className="text-center">
            <FileUpload
              label={I18n.t('FILES.UPLOAD_MODAL.BUTTONS.ADD_FILES')}
              allowedSize={maxFileSize}
              allowedTypes={allowedFileTypes}
              onChosen={this.handleUploadFile}
              singleMode={false}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            disabled={submitting || uploading.some(i => i.uploading)}
            className="btn btn-default-outline mr-auto"
            onClick={onClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            form="upload-modal-form"
            disabled={submitting || uploading.length === 0 || uploading.some(i => i.uploading)}
            className="btn btn-primary"
          >
            {I18n.t('COMMON.BUTTONS.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const FORM_NAME = 'userUploadModal';

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate: (data) => {
    const translatedLabels = translateLabels(attributeLabels);

    const rules = {};
    const labels = {};

    Object.keys(data).forEach((id) => {
      // Collect rules by field id. Example: { 'asod-as12-...': { name: ['required'] } }
      rules[id] = {
        name: ['required', 'string', 'min:3'],
        category: ['required', 'string', `in:${Object.keys(categories).join()}`],
      };

      // Collect labels by field id. Example: { 'asod-as12-123f.name': 'Name', 'asod-as12-123f.content': 'File' }
      Object.keys(translatedLabels).forEach((key) => {
        labels[`${id}.${key}`] = translatedLabels[key];
      });
    });

    return createValidator(rules, labels, false)(data);
  },
})(UploadModal);
