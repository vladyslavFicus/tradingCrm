import React, { useRef } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'react-router-dom';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import { Operator } from '__generated__/types';
import EventEmitter, { CLIENT_CALLBACK_CREATED } from 'utils/EventEmitter';
import { createValidator, translateLabels } from 'utils/validator';
import { targetTypes } from 'constants/note';
import { reminderValues } from 'constants/callbacks';
import { FormikSelectField, FormikDatePicker } from 'components/Formik';
import { Button } from 'components/UI';
import NoteButton from 'components/NoteButton';
import { useCallbackAddNoteMutation } from './graphql/__generated__/CallbackAddNoteMutation';
import { useCreateClientCallbackMutation } from './graphql/__generated__/CreateClientCallbackMutation';
import { useCallbackOperatorsQuery } from './graphql/__generated__/CallbackOperatorsQuery';
import './CreateClientCallbackModal.scss';

const attributeLabels = {
  operatorId: 'CALLBACKS.CREATE_MODAL.OPERATOR',
  callbackTime: 'CALLBACKS.CREATE_MODAL.CALLBACK_DATE_AND_TIME',
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

type FormValue = {
  operatorId: string;
  callbackTime: string;
  reminder: string;
}

type Props = {
  onCloseModal: () => void,
  notify: Notify,
}

const CreateClientCallbackModal = (props: Props) => {
  const { notify, onCloseModal } = props;
  const { id } = useParams<{ id: string }>();

  const noteButton = useRef<NoteButton>(null);

  const operatorsQuery = useCallbackOperatorsQuery({ fetchPolicy: 'network-only' });
  const [addNote] = useCallbackAddNoteMutation();
  const [createClientCallback] = useCreateClientCallbackMutation();

  const isOperatorsLoading = operatorsQuery.loading;
  const operators = operatorsQuery.data?.operators?.content as Operator[] || [];

  const createNote = async (callbackId: string) => {
    const note = noteButton.current?.getNote();

    if (note) {
      await addNote({
        variables: {
          ...note,
          targetUUID: callbackId,
          targetType: targetTypes.CLIENT_CALLBACK,
        },
      });
    }
  };

  const handleSubmit = async (values: FormValue) => {
    try {
      const responseData = await createClientCallback({ variables: { userId: id, ...values } });
      const callbackId = responseData.data?.callback?.createClientCallback?.callbackId;

      if (callbackId) {
        try {
          await createNote(callbackId);
        } catch {
          // # do nothing...
        }
      }

      EventEmitter.emit(CLIENT_CALLBACK_CREATED);
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.CREATE_MODAL.CLIENT_TITLE'),
        message: I18n.t('CALLBACKS.CREATE_MODAL.SUCCESSFULLY_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.CREATE_MODAL.ERROR.TITLE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('CALLBACKS.CREATE_MODAL.ERROR.MESSAGES.CALLBACK_EXIST')
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="CreateClientCallbackModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          operatorId: '',
          callbackTime: '',
          reminder: '',
        } as FormValue}
        validate={createValidator({
          operatorId: ['required'],
          callbackTime: ['required', 'dateWithTime'],
        }, translateLabels(attributeLabels), false)}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>{I18n.t('CALLBACKS.CREATE_MODAL.CLIENT_TITLE')}</ModalHeader>
            <ModalBody>
              <Field
                name="operatorId"
                className="CreateClientCallbackModal__field"
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

              <Field
                name="callbackTime"
                className="CreateClientCallbackModal__field"
                label={I18n.t(attributeLabels.callbackTime)}
                component={FormikDatePicker}
                withTime
                withUtc
              />

              <Field
                name="reminder"
                className="CreateClientCallbackModal__field"
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

              <div className="CreateClientCallbackModal__note">
                <NoteButton
                  manual
                  playerUUID={id}
                  targetType={targetTypes.CLIENT_CALLBACK}
                  placement="bottom"
                  ref={noteButton}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
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
};

export default compose(
  React.memo,
  withNotifications,
)(CreateClientCallbackModal);
