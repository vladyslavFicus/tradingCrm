import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { createValidator, translateLabels } from 'utils/validator';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import { Note } from 'types/Note';
import { useUpdateNoteMutation } from './graphql/__generated__/UpdateNoteMutation';
import './UpdateNoteModal.scss';

const MAX_NOTE_BODY_LENGTH = 10000;

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_NOTE_BODY_LENGTH}`],
  pinned: ['required', 'boolean'],
}, translateLabels(attributeLabels), false);

export type FormValues = {
  subject: string,
  content: string,
  pinned: boolean,
};

type Props = {
  note: Note,
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

        EventEmitter.emit(NOTE_RELOAD, { targetType: note.targetType });

        onCloseModal();
      } catch (e) {
        // Do nothing...
      }
    }
  };

  return (
    <Modal
      toggle={onCloseModal}
      isOpen
      className="UpdateNoteModal"
    >
      <Formik
        initialValues={{
          subject: note.subject || '',
          content: note.content || '',
          pinned: note.pinned || false,
        }}
        validate={validator}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, values: { content } }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('NOTES.MODAL.EDIT_TITLE')}
            </ModalHeader>
            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                type="submit"
                primary
                disabled={isSubmitting || !isValid}
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

export default React.memo(UpdateNoteModal);
