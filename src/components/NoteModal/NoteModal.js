import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSwitchField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import { attributeLabels, modalType } from './constants';
import './NoteModal.scss';

const MAX_NOTE_BODY_LENGTH = 10000;
const validator = createValidator({
  subject: 'string',
  content: ['required', 'string', `between:3,${MAX_NOTE_BODY_LENGTH}`],
  pinned: ['required', 'boolean'],
}, translateLabels(attributeLabels), false);

class NoteModal extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.shape({
      pinned: PropTypes.bool,
      subject: PropTypes.string,
      content: PropTypes.string,
    }).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(Object.keys(modalType)).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  get isDeleteMode() {
    return this.props.type === modalType.DELETE;
  }

  get title() {
    return this.isDeleteMode
      ? I18n.t('NOTES.MODAL.DELETE_TITLE')
      : I18n.t('NOTES.MODAL.EDIT_TITLE');
  }

  handleSubmit = (values) => {
    const { type, onEdit, onDelete } = this.props;

    return type === modalType.EDIT ? onEdit(values) : onDelete(values);
  };

  render() {
    const {
      initialValues: {
        pinned,
        subject,
        content,
      },
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className={classNames('note-modal', { 'modal-danger': this.isDeleteMode })}
      >
        <Formik
          initialValues={{
            pinned,
            subject,
            content,
          }}
          validate={validator}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting, isValid, values: { content: currentContent } }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {this.title}
              </ModalHeader>
              <ModalBody>
                <Choose>
                  <When condition={this.isDeleteMode}>
                    <div className="text-center font-weight-700">
                      {I18n.t('NOTES.MODAL.REMOVE_DESCRIPTION')}
                    </div>
                    <div className="remove-container card">
                      <div>{content}</div>
                      <If condition={pinned}>
                        <span className="note-item__pinned-note-badge note-badge">
                          {I18n.t('COMMON.PINNED')}
                        </span>
                      </If>
                    </div>
                  </When>
                  <Otherwise>
                    <Field
                      name="subject"
                      label={I18n.t(attributeLabels.subject)}
                      component={FormikInputField}
                      disabled={this.isDeleteMode}
                    />
                    <Field
                      name="content"
                      label={I18n.t(attributeLabels.content)}
                      component={FormikTextAreaField}
                      disabled={this.isDeleteMode}
                    />
                    <div
                      className={classNames({
                        'color-danger': currentContent && currentContent.length > MAX_NOTE_BODY_LENGTH,
                      })}
                    >
                      {`${(currentContent && currentContent.length) || 0}/${MAX_NOTE_BODY_LENGTH}`}
                    </div>
                    <Field
                      name="pinned"
                      wrapperClassName="margin-top-20"
                      label={I18n.t(attributeLabels.pin)}
                      component={FormikSwitchField}
                    />
                  </Otherwise>
                </Choose>
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Choose>
                  <When condition={this.isDeleteMode}>
                    <Button
                      type="submit"
                      danger
                      disabled={isSubmitting || !isValid}
                    >
                      {I18n.t('COMMON.BUTTONS.DELETE')}
                    </Button>
                  </When>
                  <Otherwise>
                    <Button
                      type="submit"
                      primary
                      disabled={isSubmitting || !isValid}
                    >
                      {I18n.t('COMMON.BUTTONS.CONFIRM')}
                    </Button>
                  </Otherwise>
                </Choose>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default NoteModal;
