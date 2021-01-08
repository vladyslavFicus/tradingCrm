import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { callbacksStatuses, reminderValues } from 'constants/callbacks';
import { targetTypes } from 'constants/note';
import { FormikSelectField, FormikDatePickerNew } from 'components/Formik';
import { Button } from 'components/UI';
import ShortLoader from 'components/ShortLoader';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import { createValidator } from 'utils/validator';
import getCallbackQuery from './graphql/getCallbackQuery';
import getOperatorsQuery from './graphql/getOperatorsQuery';
import updateCallbackMutation from './graphql/updateCallbackMutation';
import './CallbackDetailsModal.scss';

const attributeLabels = {
  operatorId: I18n.t('CALLBACKS.MODAL.OPERATOR'),
  callbackTime: I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME'),
  status: I18n.t('CALLBACKS.MODAL.STATUS'),
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

class CallbackDetailsModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    updateCallback: PropTypes.func.isRequired,
    operatorsData: PropTypes.object.isRequired,
    callbackData: PropTypes.object.isRequired,
  }

  handleSubmit = async (values, { setSubmitting, validateForm }) => {
    const {
      updateCallback,
      onCloseModal,
      callbackData,
      notify,
    } = this.props;

    const { callbackId } = get(callbackData, 'data.callback') || {};

    setSubmitting(false);

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

    try {
      await updateCallback({
        variables: {
          ...values,
          callbackId,
          callbackTime: moment(values.callbackTime).utc().format(),
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CALLBACKS.MODAL.TITLE'),
        message: I18n.t('CALLBACKS.MODAL.SUCCESSFULLY_UPDATED'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('CALLBACKS.MODAL.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      isOpen,
      onCloseModal,
      operatorsData,
      operatorsData: {
        loading: isLoadingOperatorsList,
      },
      callbackData,
      callbackData: {
        loading: isLoadingCallback,
      },
    } = this.props;

    const {
      callbackTime,
      callbackId,
      operatorId,
      reminder,
      client,
      status,
      userId,
      note,
    } = get(callbackData, 'data.callback') || {};

    const { content: operators } = get(operatorsData, 'data.operators') || {};

    return (
      <Modal className="CallbackDetailsModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader
          className="CallbackDetailsModal__header"
          toggle={onCloseModal}
        >
          {I18n.t('CALLBACKS.MODAL.TITLE')}
        </ModalHeader>

        <Choose>
          <When condition={isLoadingCallback}>
            <div className="CallbackDetailsModal__loader">
              <ShortLoader />
            </div>
          </When>
          <Otherwise>
            <Formik
              initialValues={{
                callbackTime: moment.utc(callbackTime).local().format(),
                operatorId,
                status,
                reminder,
              }}
              validate={
                createValidator({
                  operatorId: ['required'],
                  callbackTime: ['required', 'dateWithTime'],
                  status: ['required'],
                }, attributeLabels, false)
              }
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={this.handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="CallbackDetailsModal__client">
                      <If condition={client}>
                        <div className="CallbackDetailsModal__client-name">
                          {client.fullName}
                        </div>
                      </If>

                      <div className="CallbackDetailsModal__client-author">
                        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
                      </div>
                    </div>

                    <Field
                      name="operatorId"
                      className="CallbackDetailsModal__field"
                      placeholder={
                        I18n.t(
                          isLoadingOperatorsList
                            ? 'COMMON.SELECT_OPTION.LOADING'
                            : 'CALLBACKS.MODAL.SELECT_OPERATOR',
                        )
                      }
                      label={I18n.t('CALLBACKS.MODAL.OPERATOR')}
                      component={FormikSelectField}
                      disabled={isLoadingOperatorsList}
                      searchable
                    >
                      {operators.map(({ uuid, fullName, operatorStatus }) => (
                        <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>
                          {fullName}
                        </option>
                      ))}
                    </Field>

                    <Field
                      name="callbackTime"
                      className="CallbackDetailsModal__field"
                      label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                      component={FormikDatePickerNew}
                      withTime
                    />

                    <Field
                      name="status"
                      className="CallbackDetailsModal__field"
                      placeholder={I18n.t('CALLBACKS.MODAL.SELECT_STATUS')}
                      label={I18n.t('CALLBACKS.MODAL.STATUS')}
                      component={FormikSelectField}
                    >
                      {Object.keys(callbacksStatuses).map(callbackStatus => (
                        <option key={callbackStatus} value={callbackStatus}>
                          {I18n.t(callbacksStatuses[callbackStatus])}
                        </option>
                      ))}
                    </Field>

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

                    <div className="CallbackDetailsModal__notes">
                      <NoteButton
                        id={`callback-details-note-${callbackId}`}
                        playerUUID={userId}
                        targetUUID={callbackId}
                        targetType={targetTypes.CALLBACK}
                        note={note}
                      />
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      onClick={onCloseModal}
                      common
                    >
                      {I18n.t('COMMON.CANCEL')}
                    </Button>

                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      primary
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Otherwise>
        </Choose>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    callbackData: getCallbackQuery,
    operatorsData: getOperatorsQuery,
    updateCallback: updateCallbackMutation,
  }),
)(CallbackDetailsModal);
