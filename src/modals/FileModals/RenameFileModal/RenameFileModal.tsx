import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import './RenameFileModal.scss';

type FormValues = {
  title: string,
};

export type Props = {
  uuid: string,
  fileName: string,
  title: string,
  onSubmit: () => void,
  onUpdateFileMeta: (uuid: string, title: string) => void,
  onCloseModal: () => void,
};

const RenameFileModal = (props: Props) => {
  const {
    uuid,
    fileName,
    title,
    onSubmit,
    onUpdateFileMeta,
    onCloseModal,
  } = props;

  const handleSubmit = async (values: FormValues) => {
    try {
      await onUpdateFileMeta(uuid, values.title);

      onSubmit();
    } catch {
      // # do nothing...
    }
  };

  return (
    <Modal className="RenameFileModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ title }}
        validate={createValidator({
          title: 'required',
        })}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, isSubmitting }) => (
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
                data-testid="RenameFileModal-titleInput"
                placeholder={I18n.t('FILES.RENAME_MODAL.PLACEHOLDERS.TITLE')}
                component={FormikInputField}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
                data-testid="RenameFileModal-cancelButton"
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                danger
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
                data-testid="RenameFileModal-confirmButton"
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(RenameFileModal);
