import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator } from 'utils/validator';
import EventEmitter, { FILE_CHANGED } from 'utils/EventEmitter';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import './RenameFileModal.scss';

type FormValues = {
  title: string,
};

type FileMeta = {
  variables: {
    uuid: string,
    title: string,
  },
};

type Props = {
  uuid: string,
  fileName: string,
  onSubmit: () => void,
  updateFileMeta: (values: FileMeta) => void,
  onCloseModal: () => void,
};

const RenameFileModal = (props: Props) => {
  const {
    uuid,
    fileName,
    onSubmit,
    updateFileMeta,
    onCloseModal,
  } = props;

  const handleSubmit = async ({ title }: FormValues) => {
    try {
      await updateFileMeta({ variables: { uuid, title } });

      EventEmitter.emit(FILE_CHANGED);

      onSubmit();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILES.DOCUMENT_RENAMED'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="RenameFileModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          title: '',
        }}
        validate={createValidator({
          title: 'required',
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <ModalHeader toggle={onCloseModal} className="RenameFileModal__header">
            {I18n.t('FILES.RENAME_MODAL.TITLE')}
          </ModalHeader>

          <ModalBody className="RenameFileModal__body">
            <div className="RenameFileModal__text">
              {I18n.t('FILES.RENAME_MODAL.ACTION_TEXT', { fileName })}
            </div>

            <Field
              name="title"
              placeholder={I18n.t('FILES.RENAME_MODAL.PLACEHOLDERS.TITLE')}
              component={FormikInputField}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              tertiary
              onClick={onCloseModal}
            >
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </Button>

            <Button
              danger
              type="submit"
            >
              {I18n.t('COMMON.BUTTONS.CONFIRM')}
            </Button>
          </ModalFooter>
        </Form>
      </Formik>
    </Modal>
  );
};

export default React.memo(RenameFileModal);
