import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils } from '@crm/common';
import { FormikInputField } from 'components';
import Modal from 'components/Modal';
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
    <Formik
      initialValues={{ title }}
      validate={Utils.createValidator({
        title: 'required',
      })}
      onSubmit={handleSubmit}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => (
        <Modal
          warning
          onCloseModal={onCloseModal}
          title={I18n.t('FILES.RENAME_MODAL.TITLE')}
          buttonTitle={I18n.t('COMMON.BUTTONS.CONFIRM')}
          styleButton="danger"
          disabled={!dirty || !isValid || isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <div className="RenameFileModal__text">
              {I18n.t('FILES.RENAME_MODAL.ACTION_TEXT', { fileName })}
            </div>

            <Field
              name="title"
              data-testid="RenameFileModal-titleInput"
              placeholder={I18n.t('FILES.RENAME_MODAL.PLACEHOLDERS.TITLE')}
              component={FormikInputField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(RenameFileModal);
