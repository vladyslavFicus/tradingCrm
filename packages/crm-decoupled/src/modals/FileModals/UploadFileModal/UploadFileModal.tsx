import React, { useState } from 'react';
import I18n from 'i18n-js';
import { get, omit } from 'lodash';
import { Formik, Form } from 'formik';
import { Utils, notify, LevelType } from '@crm/common';
import { EditNote } from 'types/Note';
import { FileCategories } from 'types/fileCategories';
import FileUpload from 'components/FileUpload';
import ShortLoader from 'components/ShortLoader';
import Modal from 'components/Modal';
import UploadingFileModal from '../UploadingFileModal';
import { FileData } from '../constants';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_MAX_SIZE,
  validate,
} from './constants';
import { useUploadFileMutation } from './graphql/__generated__/UploadFileMutation';
import { useConfirmFilesUploadingMutation } from './graphql/__generated__/ConfirmFilesUploadingMutation';
import { useAddNoteMutation } from './graphql/__generated__/AddNoteMutation';
import { useFilesCategoriesQuery } from './graphql/__generated__/FilesCategoriesQuery';
import './UploadFileModal.scss';

type Errors = Array<string>;

type FormValues = Record<string, {
  title: string,
  category: string,
  documentType: string,
}>;

export type Props = {
  profileUUID: string,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const UploadFileModal = (props: Props) => {
  const { profileUUID, onCloseModal, onSuccess } = props;

  const [filesToUpload, setFilesToUpload] = useState<Array<FileData>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [uploadFileMutation] = useUploadFileMutation();
  const [confirmFilesUploadingMutation] = useConfirmFilesUploadingMutation();
  const [addNoteMutation] = useAddNoteMutation();
  const filesCategoriesQuery = useFilesCategoriesQuery();

  const filesCategories = filesCategoriesQuery.data?.filesCategories || {};
  const categories = omit(filesCategories, '__typename') as FileCategories;

  const editFileNote = (data: EditNote) => {
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

    setFilesToUpload(updatedFilesToUpload);
  };

  const removeFileNote = (targetUUID: string) => {
    const updatedFilesToUpload = filesToUpload.map((file) => {
      if (file.fileUuid === targetUUID) {
        return {
          ...file,
          fileNote: null,
        };
      }

      return file;
    });

    setFilesToUpload(updatedFilesToUpload);
  };

  const handleUploadFiles = async (
    errors: Errors | Array<Errors>,
    files: File | FileList,
    setValues: Function,
    values: FormValues,
  ) => {
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

    setLoading(true);

    const response = await Promise.all(
      Object.keys(files).map((_, fileIndex) => uploadFileMutation({
        variables: {
          file: (files as FileList)[fileIndex],
          uuid: profileUUID,
        },
      })),
    );

    const filesDataWithUuids = Object.keys(files).map((_, fileIndex) => ({
      fileUuid: get(response[fileIndex], 'data.file.upload.fileUuid'),
      file: (files as FileList)[fileIndex],
      error: get(response[fileIndex], 'error'),
    }))
      .filter(({ error }) => {
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

    setFilesToUpload([...filesToUpload, ...filesDataWithUuids]);
    setLoading(false);
  };

  const handleRemoveFileFromList = (fileUuid: string, setValues: Function, values: FormValues) => {
    const fields = { ...values };
    delete fields[fileUuid];
    setValues(fields);

    setFilesToUpload(filesToUpload.filter(item => item.fileUuid !== fileUuid));
  };

  const confirmUploadingFiles = async (data: FormValues) => {
    const documents = Object.keys(data).map(fileUuid => ({
      fileUuid,
      title: data[fileUuid].title,
      documentType: data[fileUuid].documentType,
      verificationType: data[fileUuid].category,
    }));


    try {
      await confirmFilesUploadingMutation({
        variables: {
          documents,
          profileUuid: profileUUID,
        },
      });

      await Promise.all(filesToUpload.map(({ fileNote }) => (
        (fileNote)
          ? addNoteMutation({ variables: fileNote })
          : false
      )));

      onSuccess?.();
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

  const renderFile = (
    file: FileData,
    index: number,
    setValues: Function,
    values: FormValues,
  ) => {
    const fileKey = file.fileUuid;

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
        onRemoveFileClick={fileUuid => handleRemoveFileFromList(fileUuid, setValues, values)}
        editFileNote={editFileNote}
        removeFileNote={removeFileNote}
      />
    );
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={confirmUploadingFiles}
      validate={validate}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      {({ dirty, isSubmitting, setValues, values, submitForm }) => (
        <Modal
          bigSize
          onCloseModal={onCloseModal}
          title={I18n.t('FILES.UPLOAD_MODAL.TITLE')}
          buttonTitle={I18n.t('COMMON.BUTTONS.CONFIRM')}
          disabled={isSubmitting || !dirty || filesToUpload.length === 0}
          clickSubmit={submitForm}
        >
          <Form>
            <div
              className="UploadFileModal__action-text"
              dangerouslySetInnerHTML={{
                __html: I18n.t('FILES.UPLOAD_MODAL.ACTION_TEXT', {
                  shortUUID: `<span class="font-weight-400">(${Utils.uuidShortify(profileUUID)})</span>`,
                }),
              }}
            />

            <Choose>
              <When condition={!!filesToUpload.length}>
                <table className="UploadFileModal__uploading-files">
                  <thead>
                    <tr>
                      <th className="UploadFileModal__head-cell" />

                      <th className="UploadFileModal__head-cell">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE')}
                      </th>

                      <th className="UploadFileModal__head-cell">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.FILE_INFO')}
                      </th>

                      <th className="UploadFileModal__head-cell">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY')}
                      </th>

                      <th className="UploadFileModal__head-cell">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE')}
                      </th>

                      <th className="UploadFileModal__head-cell">
                        {I18n.t('FILES.UPLOAD_MODAL.FILE.STATUS')}
                      </th>

                      <th className="UploadFileModal__head-cell" />

                      <th className="UploadFileModal__head-cell" />
                    </tr>
                  </thead>

                  <tbody>
                    {filesToUpload.map(
                      (file, index) => (
                        renderFile(file, index, setValues, values)
                      ),
                    )}
                  </tbody>
                </table>
              </When>

              <Otherwise>
                <div className="UploadFileModal__no-upload">
                  {I18n.t('FILES.UPLOAD_MODAL.NO_UPLOADED')}
                </div>
              </Otherwise>
            </Choose>

            <Choose>
              <When condition={loading}>
                <ShortLoader />
              </When>

              <Otherwise>
                <div className="UploadFileModal__upload">
                  <FileUpload
                    data-testid="UploadFileModal-fileUploadButton"
                    label={I18n.t('FILES.UPLOAD_MODAL.BUTTONS.ADD_FILES')}
                    allowedSize={ALLOWED_FILE_MAX_SIZE}
                    allowedTypes={ALLOWED_FILE_TYPES}
                    onChosen={(errors: Errors | Array<Errors>,
                      files: File | FileList) => handleUploadFiles(errors, files, setValues, values)}
                    singleMode={false}
                  />
                </div>
              </Otherwise>
            </Choose>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UploadFileModal);
