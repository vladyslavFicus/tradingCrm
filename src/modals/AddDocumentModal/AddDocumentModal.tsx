import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import Dropzone from 'react-dropzone';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import classNames from 'classnames';
import { parseErrors } from 'apollo';
import { LevelType, notify } from 'providers/NotificationProvider';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import { FILE_CONFIG, RULES, TRANSLATED_LABELS } from './constants';
import { useAddDocumentMutation } from './graphql/__generated__/AddDocumentMutation';
import { useConfirmDocumentUploadingMutation } from './graphql/__generated__/ConfirmDocumentUploading';
import './AddDocumentModal.scss';

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

type FormValues = {
  file: File | null,
  title: string,
  description: string,
};

const validate = (values: FormValues) => createValidator(RULES, translateLabels(TRANSLATED_LABELS), false)(values);

const AddDocumentModal = (props: Props) => {
  const {
    onSuccess,
    onCloseModal,
  } = props;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileUuid, setFileUuid] = useState<string | undefined>('');

  const [addDocumentMutation] = useAddDocumentMutation();
  const [confirmDocumentUploadingMutation] = useConfirmDocumentUploadingMutation();

  const handleRejectUpload = ([file]: Array<File>) => {
    if (file.size / 1024 / 1024 > FILE_CONFIG.maxSize) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: I18n.t('error.multipart.max-file-size.exceeded', { size: FILE_CONFIG.maxSize }),
      });
    }
  };

  const handleUploadDocument = async ([file]: Array<File>, setFieldValue: Function) => {
    setSubmitting(true);

    try {
      const { data } = await addDocumentMutation({ variables: { file } });
      const responseFileUuid = data?.document?.add?.fileUuid;

      setFieldValue('file', file);
      setFileUuid(responseFileUuid);
    } catch (e) {
      const error = parseErrors(e);

      const errorMessage = error.errorParameters?.errorMessage || error.message || 'COMMON.SOMETHING_WRONG';

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.UPLOAD_FAILED'),
        message: I18n.t(errorMessage),
      });
    }

    setSubmitting(false);
  };

  const confirmUploadingFiles = async (data: FormValues) => {
    try {
      if (fileUuid) {
        await confirmDocumentUploadingMutation({
          variables: {
            args: {
              uuid: fileUuid,
              title: data.title,
              description: data.description,
            },
          },
        });

        await onSuccess();

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.SUCCESS'),
        });
      }
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILES.UPLOAD_MODAL.FILE.NOTIFICATIONS.ERROR'),
      });
    }

    onCloseModal();
  };

  const handleReset = (resetForm: () => void) => {
    resetForm();
  };

  const getSize = (values: FormValues) => {
    const size = (values?.file as File | null)?.size || 0;
    const sizeKb = size / 1024;
    const sizeMb = size / 1024 / 1024;

    if (sizeMb * 100 < 1) {
      return `${(sizeKb).toFixed(2)}Kb`;
    }

    return `${(sizeMb).toFixed(2)}Mb`;
  };

  return (
    <Modal className="AddDocumentModal" isOpen toggle={onCloseModal}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          file: null,
        } as FormValues}
        onSubmit={confirmUploadingFiles}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
      >
        {({ setFieldValue, values, resetForm }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.TITLE_MODAL')}
            </ModalHeader>

            <ModalBody>
              <div className="AddDocumentModal__header">
                <Field
                  name="title"
                  data-testid="AddDocumentModal-titleInput"
                  label={`${I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.TITLE')}`}
                  component={FormikInputField}
                />

                <Field
                  name="description"
                  data-testid="AddDocumentModal-descriptionInput"
                  label={I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.DESCRIPTION')}
                  component={FormikInputField}
                />
              </div>

              <Choose>
                <When condition={!!values?.file}>
                  <p><b>File name: </b>{(values?.file as File | null)?.name}</p>

                  <br />

                  <p>
                    <b>File size: </b>
                    {getSize(values)}
                  </p>
                </When>

                <Otherwise>
                  <Dropzone
                    name="file"
                    disabled={submitting}
                    multiple={false}
                    accept={FILE_CONFIG.types}
                    maxSize={FILE_CONFIG.maxSize * 1024 * 1024}
                    onDropAccepted={e => handleUploadDocument(e, setFieldValue)}
                    onDropRejected={handleRejectUpload}
                    className={
                      classNames(
                        'AddDocumentModal__dropzone',
                        {
                          'AddDocumentModal__dropzone--submitting': submitting,
                        },
                      )
                    }
                    activeClassName="AddDocumentModal__dropzone-active"
                    acceptClassName="AddDocumentModal__dropzone-accept"
                  >
                    <div className="AddDocumentModal__dropzone-content">
                      <img
                        src="/img/upload-icon.svg"
                        className="AddDocumentModal__dropzone-upload-image"
                        alt="upload-icon"
                      />

                      <div className="AddDocumentModal__dropzone-info">
                        <p>{I18n.t('FILE_DROPZONE.DRAG_HERE_OR')}</p>

                        <Button
                          secondary
                          submitting={submitting}
                          className={classNames('AddDocumentModal__dropzone-button', {
                            'AddDocumentModal__dropzone-button--submitting': submitting,
                          })}
                          data-testid="AddDocumentModal-browseFileButton"
                        >
                          {I18n.t('FILE_DROPZONE.BROWSE_FILES')}
                        </Button>
                      </div>
                    </div>
                  </Dropzone>
                </Otherwise>
              </Choose>
            </ModalBody>

            <ModalFooter>
              <If condition={!!values?.file}>
                <Button
                  data-testid="AddDocumentModal-resetButton"
                  onClick={() => handleReset(resetForm)}
                  danger
                >
                  {I18n.t('COMMON.RESET')}
                </Button>
              </If>

              <Button
                secondary
                onClick={onCloseModal}
                data-testid="AddDocumentModal-cancelButton"
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>

              <Button
                data-testid="AddDocumentModal-confirmButton"
                disabled={!fileUuid || !values.title}
                secondary
                type="submit"
              >
                {I18n.t('COMMON.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(AddDocumentModal);
