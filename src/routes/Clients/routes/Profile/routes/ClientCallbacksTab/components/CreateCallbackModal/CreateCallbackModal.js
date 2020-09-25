import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { FormikSelectField, FormikDatePicker } from 'components/Formik';
import { Button } from 'components/UI';
import NoteButton from 'components/NoteButton';
import { reminderValues } from 'constants/callbacks';
import { createValidator, translateLabels } from 'utils/validator';
import getOperatorsQuery from './graphql/getOperatorsQuery';
import createCallbackMutation from './graphql/createCallbackMutation';
import addNoteMutation from './graphql/addNoteMutation';
import './CreateCallbackModal.scss';

const attributeLabels = {
  operatorId: 'CALLBACKS.CREATE_MODAL.OPERATOR',
  callbackTime: 'CALLBACKS.CREATE_MODAL.CALLBACK_DATE_AND_TIME',
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

const validate = createValidator({
  operatorId: ['required'],
  callbackTime: ['required', 'dateWithTime'],
}, translateLabels(attributeLabels), false);

class CreateCallbackModal extends PureComponent {
  static propTypes = {
    operatorsData: PropTypes.query({
      operators: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.arrayOf(
            PropTypes.shape({
              uuid: PropTypes.string,
              fullName: PropTypes.string,
            }),
          ),
        }),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    createCallback: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  };

  createNote = async (callbackId) => {
    const note = this.noteButton.getNote();

    if (note) {
      await this.props.addNote({
        variables: {
          ...this.noteButton.getNote(),
          targetUUID: callbackId,
          targetType: targetTypes.CALLBACK,
        },
      });
    }
  }

  handleSubmit = async (values, { setSubmitting }) => {
    const {
      match: {
        params: {
          id,
        },
      },
      createCallback,
      onCloseModal,
      onSuccess,
      notify,
    } = this.props;

    try {
      const responseData = await createCallback({
        variables: {
          userId: id,
          ...values,
        },
      });

      const callbackId = get(responseData, 'data.callback.create.callbackId');

      if (callbackId) {
        await this.createNote(callbackId);
      }

      onCloseModal();
      onSuccess();

      notify({
        level: 'success',
        title: I18n.t('CALLBACKS.CREATE_MODAL.TITLE'),
        message: I18n.t('CALLBACKS.CREATE_MODAL.SUCCESSFULLY_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('CALLBACKS.CREATE_MODAL.ERROR.TITLE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('CALLBACKS.CREATE_MODAL.ERROR.MESSAGES.CALLBACK_EXIST')
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      match: {
        params: {
          id,
        },
      },
      operatorsData,
      onCloseModal,
      isOpen,
    } = this.props;

    const isOperatorsLoading = operatorsData.loading;
    const operators = get(operatorsData, 'data.operators.content') || [];

    return (
      <Modal className="CreateCallbackModal" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{}}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('CALLBACKS.CREATE_MODAL.TITLE')}</ModalHeader>
              <ModalBody>
                <Field
                  name="operatorId"
                  component={FormikSelectField}
                  label={I18n.t(attributeLabels.operatorId)}
                  placeholder={
                    I18n.t(isOperatorsLoading
                      ? 'COMMON.SELECT_OPTION.LOADING'
                      : 'CALLBACKS.CREATE_MODAL.SELECT_OPERATOR')
                  }
                  disabled={isSubmitting || isOperatorsLoading}
                  searchable
                >
                  {operators.map(({ uuid, fullName, operatorStatus }) => (
                    <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>{fullName}</option>
                  ))}
                </Field>

                <FormikDatePicker
                  name="callbackTime"
                  label={I18n.t(attributeLabels.callbackTime)}
                  closeOnSelect={false}
                  withTime
                  utc
                />

                <Field
                  name="reminder"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  label={I18n.t(attributeLabels.reminder)}
                  component={FormikSelectField}
                >
                  {reminderValues.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Field>

                <div className="CreateCallbackModal__note">
                  <NoteButton
                    manual
                    playerUUID={id}
                    targetType={targetTypes.CALLBACK}
                    placement="bottom"
                    ref={(ref) => { this.noteButton = ref; }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  className="CreateDeskModal__button"
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>

                <Button
                  className="CreateDeskModal__button"
                  primary
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('COMMON.BUTTONS.CREATE')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withRequests({
    addNote: addNoteMutation,
    createCallback: createCallbackMutation,
    operatorsData: getOperatorsQuery,
  }),
)(CreateCallbackModal);
