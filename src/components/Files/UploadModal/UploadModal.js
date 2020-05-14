import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import FileUpload from 'components/FileUpload';
import UploadingFile from 'components/Files/UploadingFile';
import ShortLoader from 'components/ShortLoader';
import { shortify } from 'utils/uuid';
import { ALLOWED_FILE_TYPES, ALLOWED_FILE_MAX_SIZE } from './constants';

class UploadModal extends Component {
  static propTypes = {
    dirty: PropTypes.bool,
    invalid: PropTypes.bool,
    change: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    uploadFile: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    confirmUploadedFiles: PropTypes.func.isRequired,
    newProfile: PropTypes.newProfile.isRequired,
    getFilesCategoriesList: PropTypes.object.isRequired,
  }

  static defaultProps = {
    invalid: true,
    dirty: false,
  }

  state = {
    filesToUpload: [],
    loading: false,
  }

  noteButton = null;

  updateFileNote = (data) => {
    const { filesToUpload } = this.state;
    const { targetUUID } = data;

    const updatedFilesToUpload = filesToUpload.map((file) => {
      if (file.fileUuid === targetUUID) {
        return {
          ...file,
          fileNote: data,
        };
      }

      return file;
    });

    this.setState({ filesToUpload: updatedFilesToUpload });
  }

  removeFileNote = (targetUUID) => {
    const { filesToUpload } = this.state;

    const updatedFilesToUpload = filesToUpload.map((file) => {
      if (file.fileUuid === targetUUID) {
        const { fileNote, ...rest } = file;

        return {
          ...rest,
        };
      }

      return file;
    });

    this.setState({ filesToUpload: updatedFilesToUpload });
  }

  handleUploadFiles = async (errors, files) => {
    const {
      uploadFile,
      newProfile: {
        uuid: profileUUID,
      },
      notify,
    } = this.props;

    if (errors.length > 0) {
      const flatErrorsList = errors.flat();

      if (flatErrorsList.length > 0) {
        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t(flatErrorsList[0]),
        });

        return;
      }
    }

    this.setState({ loading: true });

    const response = await Promise.all(
      Object.keys(files).map(fileIndex => uploadFile({
        variables: {
          file: files[fileIndex],
          profileUUID,
        },
      })),
    );

    const filesDataWithUuids = Object.keys(files).map(fileIndex => ({
      fileUuid: get(response[fileIndex], 'data.file.upload.data.fileUuid'),
      file: files[fileIndex],
      error: get(response[fileIndex], 'data.file.upload.error'),
    })).filter(({ error }) => {
      if (error) {
        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.FILE_TYPE_ERROR'),
        });
      }

      return !error;
    });

    this.setState(({ filesToUpload }) => ({
      filesToUpload: [...filesToUpload, ...filesDataWithUuids],
      loading: false,
    }));
  }

  handleRemoveFileFromList = (fileUuid) => {
    this.setState(({ filesToUpload }) => ({
      filesToUpload: filesToUpload.filter(item => item.fileUuid !== fileUuid),
    }));
  }

  confirmUploadingFiles = async (data) => {
    const {
      onClose,
      onSuccess,
      addNote,
      notify,
      confirmUploadedFiles,
      newProfile: {
        uuid: profileUuid,
      },
    } = this.props;

    const { filesToUpload } = this.state;

    const documents = Object.keys(data).map(fileUuid => ({
      fileUuid,
      title: data[fileUuid].title,
      documentType: data[fileUuid].documentType,
      verificationType: data[fileUuid].category,
    }));

    const confirmationResponse = await confirmUploadedFiles({
      variables: {
        documents,
        profileUuid,
      },
    });

    const success = get(confirmationResponse, 'data.file.confirmFiles.data.success') || false;

    if (success) {
      await Promise.all(filesToUpload.map(({ fileNote }) => (
        (fileNote)
          ? addNote({ variables: fileNote })
          : false
      )));
    }

    notify({
      level: success ? 'success' : 'error',
      title: success ? I18n.t('COMMON.SUCCESS') : I18n.t('COMMON.FAIL'),
      message: success
        ? I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.SUCCESS')
        : I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.ERROR'),
    });

    if (success) {
      onClose();
      onSuccess();
    }
  }

  renderFile = (file, index) => {
    const {
      newProfile: {
        uuid: profileUUID,
      },
      getFilesCategoriesList,
      change,
    } = this.props;

    const { __typename, ...categories } = get(getFilesCategoriesList, 'filesCategoriesList.data') || {};

    return (
      <UploadingFile
        change={change}
        fileData={file}
        number={index + 1}
        key={file.fileUuid}
        categories={categories}
        profileUUID={profileUUID}
        onRemoveFileClick={this.handleRemoveFileFromList}
        addFileNote={this.updateFileNote}
        updateFileNote={this.updateFileNote}
        removeFileNote={this.removeFileNote}
      />
    );
  }

  render() {
    const {
      onClose,
      newProfile: {
        firstName,
        lastName,
        uuid: profileUUID,
      },
      handleSubmit,
      submitting,
      invalid,
      dirty,
    } = this.props;

    const {
      filesToUpload,
      loading,
    } = this.state;

    return (
      <Modal
        className="upload-modal"
        backdrop="static"
        keyboard={false}
        toggle={onClose}
        isOpen
      >
        <ModalHeader toggle={onClose}>
          {I18n.t('FILES.UPLOAD_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="upload-modal-form"
          onSubmit={handleSubmit(this.confirmUploadingFiles)}
        >
          <div
            className="text-center font-weight-700"
            dangerouslySetInnerHTML={{
              __html: I18n.t('FILES.UPLOAD_MODAL.ACTION_TEXT', {
                fullName: `${firstName} ${lastName}`,
                shortUUID: `<span class="font-weight-400">(${shortify(profileUUID)})</span>`,
              }),
            }}
          />

          <Choose>
            <When condition={filesToUpload.length}>
              <div className="my-4">
                <table className="uploading-files">
                  <thead>
                    <tr>
                      <th className="uploading-files__col uploading-files__col-number" />
                      <th className="uploading-files__col uploading-files__col-name">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE')}
                      </th>
                      <th className="uploading-files__col uploading-files__col-info">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.FILE_INFO')}
                      </th>
                      <th className="uploading-files__col uploading-files__col-category">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY')}
                      </th>
                      <th className="uploading-files__col uploading-files__col-type">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE')}
                      </th>
                      <th className="uploading-files__col uploading-files__col-status">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.STATUS')}
                      </th>
                      <th className="uploading-files__col uploading-files__col-delete" />
                      <th className="uploading-files__col uploading-files__col-note" />
                    </tr>
                  </thead>
                  <tbody>
                    {filesToUpload.map(this.renderFile)}
                  </tbody>
                </table>
              </div>
            </When>
            <Otherwise>
              <div className="my-4">
                <div className="text-center text-muted font-size-12">
                  {I18n.t('FILES.UPLOAD_MODAL.NO_UPLOADED')}
                </div>
              </div>
            </Otherwise>
          </Choose>

          <Choose>
            <When condition={loading}>
              <div className="uploading-files__loader">
                <ShortLoader />
              </div>
            </When>
            <Otherwise>
              <div className="text-center">
                <FileUpload
                  label={I18n.t('FILES.UPLOAD_MODAL.BUTTONS.ADD_FILES')}
                  allowedSize={ALLOWED_FILE_MAX_SIZE}
                  allowedTypes={ALLOWED_FILE_TYPES}
                  onChosen={this.handleUploadFiles}
                  singleMode={false}
                />
              </div>
            </Otherwise>
          </Choose>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            disabled={submitting}
            className="btn btn-default-outline mr-auto"
            onClick={onClose}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            form="upload-modal-form"
            disabled={submitting || invalid || !dirty || filesToUpload.length === 0}
            className="btn btn-primary"
          >
            {I18n.t('COMMON.BUTTONS.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default UploadModal;
