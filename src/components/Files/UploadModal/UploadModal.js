import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form } from 'formik';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import FileUpload from 'components/FileUpload';
import UploadingFile from 'components/Files/UploadingFile';
import ShortLoader from 'components/ShortLoader';
import { Button } from 'components/UI';
import { shortify } from 'utils/uuid';
import EventEmitter, { FILE_UPLOADED } from 'utils/EventEmitter';
import { createValidator, translateLabels } from 'utils/validator';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_MAX_SIZE,
  translatedLabels,
} from './constants';
import {
  FilesCategoriesQuery,
  ConfirmUploadedFiles,
  UploadFile,
  AddNote,
} from './graphql';

class UploadModal extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    filesCategoriesQuery: PropTypes.query({
      filesCategoriesList: PropTypes.object,
    }).isRequired,
    confirmUploadedFiles: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    profileUUID: PropTypes.string.isRequired,
  };

  state = {
    filesToUpload: [],
    loading: false,
  };

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

  handleUploadFiles = async (errors, files) => {
    const {
      profileUUID,
      uploadFile,
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
      notify,
      confirmUploadedFiles,
      profileUUID,
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
        profileUuid: profileUUID,
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
      EventEmitter.emit(FILE_UPLOADED, documents);
      onCloseModal();
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
      filesCategoriesQuery,
    } = this.props;

    const fileKey = file.fileUuid;
    const { __typename, ...categories } = get(filesCategoriesQuery, 'data.filesCategoriesList.data') || {};

    return (
      <UploadingFile
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
        addFileNote={this.updateFileNote}
        updateFileNote={this.updateFileNote}
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
        className="upload-modal"
        backdrop="static"
        keyboard={false}
        toggle={onCloseModal}
        isOpen
      >
        <Formik
          initialValues={{}}
          onSubmit={this.confirmUploadingFiles}
          validate={(values) => {
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
          }}
          enableReinitialize
        >
          {({ dirty, isValid, isSubmitting, setValues, values }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('FILES.UPLOAD_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <div
                  className="text-center font-weight-700"
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
                        onChosen={this.handleUploadFiles}
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
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid || filesToUpload.length === 0}
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
  withNotifications,
  withRequests({
    filesCategoriesQuery: FilesCategoriesQuery,
    confirmUploadedFiles: ConfirmUploadedFiles,
    uploadFile: UploadFile,
    addNote: AddNote,
  }),
)(UploadModal);
