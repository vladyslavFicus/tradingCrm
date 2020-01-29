import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { TextAreaField, SwitchField, InputField } from 'components/ReduxForm';
import { attributeLabels, modalType } from './constants';
import './NoteModal.scss';

const FORM_NAME = 'noteModalForm';
const MAX_NOTE_BODY_LENGTH = 10000;

class NoteModal extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      pinned: PropTypes.bool,
      subject: PropTypes.string,
      content: PropTypes.string,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(Object.keys(modalType)).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      contentLength: props.initialValues.content.length,
    };
  }

  get isDeleteMode() {
    return this.props.type === modalType.DELETE;
  }

  get title() {
    return this.isDeleteMode
      ? I18n.t('NOTES.MODAL.DELETE_TITLE')
      : I18n.t('NOTES.MODAL.EDIT_TITLE');
  }

  handleSubmit = (data) => {
    const { type, onEdit, onDelete } = this.props;

    return type === modalType.EDIT ? onEdit(data) : onDelete(data);
  };

  onHandleContentChange = ({ target: { textLength } }) => {
    this.setState({ contentLength: textLength });
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      initialValues: {
        pinned,
        content,
      },
      invalid,
      submitting,
    } = this.props;

    const { contentLength } = this.state;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className={classNames('note-modal', { 'modal-danger': this.isDeleteMode })}
      >
        <ModalHeader toggle={onCloseModal}>
          {this.title}
        </ModalHeader>
        <ModalBody
          tag="form"
          onSubmit={handleSubmit(this.handleSubmit)}
          id="note-modal-form"
        >
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
                placeholder=""
                type="text"
                component={InputField}
                showErrorMessage={false}
                disabled={this.isDeleteMode}
              />
              <Field
                name="content"
                label={I18n.t(attributeLabels.content)}
                onChange={this.onHandleContentChange}
                component={TextAreaField}
                showErrorMessage={false}
                disabled={this.isDeleteMode}
              />
              <div
                className={classNames('', {
                  'color-danger': contentLength > MAX_NOTE_BODY_LENGTH,
                })}
              >
                {`${contentLength}/${MAX_NOTE_BODY_LENGTH}`}
              </div>
              <Field
                name="pinned"
                wrapperClassName="margin-top-20"
                label={I18n.t(attributeLabels.pin)}
                component={SwitchField}
              />
            </Otherwise>
          </Choose>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || submitting || contentLength > MAX_NOTE_BODY_LENGTH}
            className={classNames('btn', this.isDeleteMode ? 'btn-danger' : 'btn-primary')}
            form="note-modal-form"
          >
            <Choose>
              <When condition={this.isDeleteMode}>
                {I18n.t('COMMON.BUTTONS.DELETE')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Otherwise>
            </Choose>
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const NoteForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    content: ['required', 'string'],
    pinned: ['required', 'boolean'],
  }, translateLabels(attributeLabels), false),
})(NoteModal);

export default NoteForm;
