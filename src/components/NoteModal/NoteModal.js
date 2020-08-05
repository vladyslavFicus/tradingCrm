import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import EventEmitter, { NOTE_UPDATED } from 'utils/EventEmitter';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdateNoteMutation from './graphql/UpdateNoteMutation';
import { attributeLabels } from './constants';
import './NoteModal.scss';

const MAX_NOTE_BODY_LENGTH = 10000;

const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_NOTE_BODY_LENGTH}`],
  pinned: ['required', 'boolean'],
}, translateLabels(attributeLabels), false);

class NoteModal extends PureComponent {
  static propTypes = {
    note: PropTypes.noteEntity.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  handleSubmit = async (variables) => {
    const { updateNote, onCloseModal } = this.props;

    try {
      await updateNote({ variables });

      EventEmitter.emit(NOTE_UPDATED, variables);

      onCloseModal();
    } catch (e) {
      // Do nothing...
    }
  };

  render() {
    const {
      note,
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="note-modal"
      >
        <Formik
          initialValues={note}
          validate={validator}
          onSubmit={this.handleSubmit}
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
                  component={FormikTextAreaField}
                />
                <div
                  className={classNames({
                    'color-danger': content && content.length > MAX_NOTE_BODY_LENGTH,
                  })}
                >
                  {`${(content && content.length) || 0}/${MAX_NOTE_BODY_LENGTH}`}
                </div>
                <Field
                  name="pinned"
                  wrapperClassName="margin-top-20"
                  label={I18n.t(attributeLabels.pin)}
                  component={FormikSwitchField}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
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
  }
}

export default withRequests({
  updateNote: UpdateNoteMutation,
})(NoteModal);
