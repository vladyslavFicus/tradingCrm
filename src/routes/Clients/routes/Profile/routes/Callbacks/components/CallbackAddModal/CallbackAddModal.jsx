import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NoteButton from 'components/NoteButton';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { targetTypes } from 'constants/note';
import { NasSelectField, DateTimeField } from 'components/ReduxForm';

class CallbackAddModal extends Component {
  static propTypes = {
    operators: PropTypes.object.isRequired,
    className: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    createCallback: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    pristine: PropTypes.bool,
    onConfirm: PropTypes.func,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
    error: null,
    submitting: false,
    valid: false,
    pristine: true,
    onConfirm: () => {},
  };

  createNote = async (targetUUID) => {
    const note = this.noteButton.getNote();

    if (note) {
      await this.props.addNote({
        variables: {
          ...this.noteButton.getNote(),
          targetUUID,
          targetType: targetTypes.CALLBACK,
        },
      });
    }
  };

  handleSubmit = async ({ operatorId, callbackTime }) => {
    const { notify, onCloseModal, onConfirm, createCallback } = this.props;

    const { data: { callback: { create: { data, error } } } } = await createCallback({
      variables: {
        operatorId,
        callbackTime,
      },
    });

    if (data && data._id) {
      await this.createNote(data._id);
    }

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('CALLBACKS.CREATE_MODAL.TITLE'),
      message: error
        ? I18n.t('COMMON.SOMETHING_WRONG')
        : I18n.t('CALLBACKS.CREATE_MODAL.SUCCESSFULLY_CREATED'),
    });

    if (!error) {
      onCloseModal();
      onConfirm();
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      className,
      operators,
      operators: { loading },
      handleSubmit,
      error,
      submitting,
      valid,
      pristine,
      userId,
    } = this.props;

    const operatorsList = get(operators, 'operators.data.content', []);

    return (
      <Modal isOpen={isOpen} toggle={onCloseModal} className={className}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('CALLBACKS.CREATE_MODAL.TITLE')}</ModalHeader>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div>
              <If condition={error}>
                <div className="alert alert-warning animated fadeIn">
                  {error}
                </div>
              </If>
              <Field
                name="operatorId"
                label={I18n.t('CALLBACKS.CREATE_MODAL.OPERATOR')}
                placeholder={
                  I18n.t(loading ? 'COMMON.SELECT_OPTION.LOADING' : 'CALLBACKS.CREATE_MODAL.SELECT_OPERATOR')
                }
                disabled={loading}
                component={NasSelectField}
                searchable
              >
                {operatorsList.map(item => (
                  <option key={item.uuid} value={item.uuid}>{item.fullName}</option>
                ))}
              </Field>
              <Field
                withTime
                closeOnSelect={false}
                name="callbackTime"
                label={I18n.t('CALLBACKS.CREATE_MODAL.CALLBACK_DATE_AND_TIME')}
                component={DateTimeField}
                isValidDate={() => (true)}
              />
            </div>
            <div className="form-row justify-content-center">
              <NoteButton
                manual
                ref={(ref) => { this.noteButton = ref; }}
                placement="bottom"
                playerUUID={userId}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseModal}>{I18n.t('COMMON.CANCEL')}</Button>
            <Button
              type="submit"
              color="primary"
              disabled={pristine || submitting || !!error || !valid}
            >
              {I18n.t('COMMON.CREATE')}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const attributeLabels = {
  operatorId: I18n.t('CALLBACKS.CREATE_MODAL.OPERATOR'),
  callbackTime: I18n.t('CALLBACKS.CREATE_MODAL.TIME'),
};

export default reduxForm({
  form: 'callback-add-form',
  validate: createValidator({
    operatorId: ['required'],
    callbackTime: ['required'],
  }, attributeLabels, false),
})(CallbackAddModal);
