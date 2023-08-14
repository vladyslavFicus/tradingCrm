import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Types } from '@crm/common';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import Modal from 'components/Modal';
import { useUpdateNoteMutation } from './graphql/__generated__/UpdateNoteMutation';
import { MAX_NOTE_BODY_LENGTH, attributeLabels, validator } from './constants';
import './UpdateNoteModal.scss';

export type FormValues = {
  subject: string,
  content: string,
  pinned: boolean,
};

export type Props = {
  note: Types.Note,
  onCloseModal: () => void,
};

const UpdateNoteModal = (props: Props) => {
  const { note, onCloseModal } = props;

  const [updateNoteMutation] = useUpdateNoteMutation();

  const handleSubmit = async (formValues: FormValues) => {
    if (note.noteId) {
      const variables = { ...formValues, noteId: note.noteId };

      try {
        await updateNoteMutation({ variables });

        Utils.EventEmitter.emit(Utils.NOTE_RELOAD, { targetType: note.targetType });

        onCloseModal();
      } catch (e) {
        // Do nothing...
      }
    }
  };

  return (
    <Formik
      initialValues={{
        subject: note.subject || '',
        content: note.content || '',
        pinned: note.pinned || false,
      }}
      validate={validator}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, values: { content }, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('NOTES.MODAL.EDIT_TITLE')}
          buttonTitle={I18n.t('COMMON.BUTTONS.CONFIRM')}
          disabled={isSubmitting || !isValid}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="subject"
              label={I18n.t(attributeLabels.subject)}
              component={FormikInputField}
            />

            <Field
              name="content"
              label={I18n.t(attributeLabels.content)}
              maxLength={MAX_NOTE_BODY_LENGTH}
              component={FormikTextAreaField}
            />

            <div>
              {`${(content && content.length) || 0}/${MAX_NOTE_BODY_LENGTH}`}
            </div>

            <Field
              name="pinned"
              wrapperClassName="UpdateNoteModal__pinned"
              label={I18n.t(attributeLabels.pin)}
              component={FormikSwitchField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateNoteModal);
