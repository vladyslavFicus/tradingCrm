import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form } from 'formik';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import FileUpload from 'components/FileUpload';
import ShortLoader from 'components/ShortLoader';
import { Button } from 'components/UI';
import { shortify } from 'utils/uuid';
import EventEmitter, { FILE_UPLOADED } from 'utils/EventEmitter';
import { createValidator, translateLabels } from 'utils/validator';
import UploadingFileModal from '../UploadingFileModal';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_MAX_SIZE,
  translatedLabels,
} from './constants';
import {
  FilesCategoriesQuery,
  ConfirmFilesUploading,
  UploadFile,
  AddNote,
} from './graphql';
import './UploadModal.scss';

const validate = (values) => {
  const rules = {};
  const labels = {};

  Object.keys(values).forEach((fieldKey) => {
    const fileUuid = fieldKey.split('.')[0];

    rules[fileUuid] = {
      title: ['required', 'string'],
      category: ['required', 'string'],
      documentType: ['required', 'string'],
    };

    Object.keys(translatedLabels).forEach((key) => {
      labels[`${fileUuid}.${key}`] = translatedLabels[key];
    });
  });

  return createValidator(rules, translateLabels(labels), false)(values);
};

class UploadModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    confirmFilesUploading: PropTypes.func.isRequired,
    filesCategoriesData: PropTypes.object.isRequired,
    profileUUID: PropTypes.string.isRequired,
  };

  state = {
    filesToUpload: [],
    loading: false,
  };

  noteButton = null;

  editFileNote = (data) => {
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
  };

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
  };

  handleUploadFiles = async (errors, files, setValues, values) => {
    const {
      profileUUID,
      uploadFile,
    } = this.props;

    if (errors.length > 0) {
      const flatErrorsList = errors.flat();

      if (flatErrorsList.length > 0) {
        notify({
          level: LevelType.ERROR,
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
          uuid: profileUUID,
        },
      })),
    );

    const filesDataWithUuids = Object.keys(files).map(fileIndex => ({
      fileUuid: get(response[fileIndex], 'data.file.upload.fileUuid'),
      file: files[fileIndex],
      error: get(response[fileIndex], 'error'),
    })).filter(({ error }) => {
      if (error) {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.FILE_TYPE_ERROR'),
        });
      }

      return !error;
    });

    const initialValues = filesDataWithUuids.reduce((acc, { fileUuid }) => (
      { ...acc, [fileUuid]: { title: '', category: '' } }), {});

    setValues({ ...initialValues, ...values });

    this.setState(({ filesToUpload }) => ({
      filesToUpload: [...filesToUpload, ...filesDataWithUuids],
      loading: false,
    }));
  };

  handleRemoveFileFromList = (fileUuid, setValues, values) => {
    const fields = { ...values };
    delete fields[fileUuid];
    setValues(fields);

    this.setState(({ filesToUpload }) => ({
      filesToUpload: filesToUpload.filter(item => item.fileUuid !== fileUuid),
    }));
  };

  confirmUploadingFiles = async (data) => {
    const {
      onCloseModal,
      addNote,
      confirmFilesUploading,
      profileUUID,
    } = this.props;

    const { filesToUpload } = this.state;

    const documents = Object.keys(data).map(fileUuid => ({
      fileUuid,
      title: data[fileUuid].title,
      documentType: data[fileUuid].documentType,
      verificationType: data[fileUuid].category,
    }));


    try {
      await confirmFilesUploading({
        variables: {
          documents,
          profileUuid: profileUUID,
        },
      });

      await Promise.all(filesToUpload.map(({ fileNote }) => (
        (fileNote)
          ? addNote({ variables: fileNote })
          : false
      )));

      EventEmitter.emit(FILE_UPLOADED, documents);
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.ERROR'),
      });
    }
  };

  renderFile = (
    file,
    index,
    setValues,
    values,
  ) => {
    const {
      profileUUID,
      filesCategoriesData,
    } = this.props;

    const fileKey = file.fileUuid;
    const { __typename, ...categories } = get(filesCategoriesData, 'data.filesCategories') || {};

    return (
      <UploadingFileModal
        customFieldChange={fields => (
          setValues({
            ...values,
            [fileKey]: {
              ...values[fileKey],
              ...fields,
            },
          })
        )}
        fileData={file}
        number={index + 1}
        key={fileKey}
        categories={categories}
        profileUUID={profileUUID}
        onRemoveFileClick={fileUuid => this.handleRemoveFileFromList(fileUuid, setValues, values)}
        editFileNote={this.editFileNote}
        removeFileNote={this.removeFileNote}
      />
    );
  };

  render() {
    const {
      onCloseModal,
      profileUUID,
    } = this.props;

    const {
      filesToUpload,
      loading,
    } = this.state;

    return (
      <Modal
        className="UploadModal"
        backdrop="static"
        keyboard={false}
        toggle={onCloseModal}
        isOpen
      >
        <Formik
          initialValues={{}}
          onSubmit={this.confirmUploadingFiles}
          validate={validate}
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize
        >
          {({ dirty, isSubmitting, setValues, values }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('FILES.UPLOAD_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <div
                  className="UploadModal__action-text"
                  dangerouslySetInnerHTML={{
                    __html: I18n.t('FILES.UPLOAD_MODAL.ACTION_TEXT', {
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
                            <th className="UploadModal__head-cell" />
                            <th className="UploadModal__head-cell">
                              {I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE')}
                            </th>
                            <th className="UploadModal__head-cell">
                              {I18n.t('FILES.UPLOAD_MODAL.FILE.FILE_INFO')}
                            </th>
                            <th className="UploadModal__head-cell">
                              {I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY')}
                            </th>
                            <th className="UploadModal__head-cell">
                              {I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE')}
                            </th>
                            <th className="UploadModal__head-cell">
                              {I18n.t('FILES.UPLOAD_MODAL.FILE.STATUS')}
                            </th>
                            <th className="UploadModal__head-cell" />
                            <th className="UploadModal__head-cell" />
                          </tr>
                        </thead>
                        <tbody>
                          {filesToUpload.map(
                            (file, index) => (
                              this.renderFile(file, index, setValues, values)
                            ),
                          )}
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
                        onChosen={(errors, files) => this.handleUploadFiles(errors, files, setValues, values)}
                        singleMode={false}
                      />
                    </div>
                  </Otherwise>
                </Choose>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  disabled={isSubmitting}
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !dirty || filesToUpload.length === 0}
                  primary
                >
                  {I18n.t('COMMON.BUTTONS.CONFIRM')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withRequests({
    filesCategoriesData: FilesCategoriesQuery,
    confirmFilesUploading: ConfirmFilesUploading,
    uploadFile: UploadFile,
    addNote: AddNote,
  }),
)(UploadModal);
