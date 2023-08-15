import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants, parseErrors, notify, Types } from '@crm/common';
import { Operator } from '__generated__/types';
import { FormikSingleSelectField, FormikDatePicker } from 'components';
import Modal from 'components/Modal';
import NoteActionManual from 'components/Note/NoteActionManual';
import { useCallbackAddNoteMutation } from './graphql/__generated__/CallbackAddNoteMutation';
import { useCreateLeadCallbackMutation } from './graphql/__generated__/CreateLeadCallbackMutation';
import { useGetOperatorsQuery } from './graphql/__generated__/GetOperatorsQuery';
import './CreateLeadCallbackModal.scss';

const attributeLabels = {
  operatorId: 'CALLBACKS.CREATE_MODAL.OPERATOR',
  callbackTime: 'CALLBACKS.CREATE_MODAL.CALLBACK_DATE_AND_TIME',
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

type FormValue = {
  operatorId: string,
  callbackTime: string,
  reminder: string,
};

export type Props = {
  userId: string,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const CreateLeadCallbackModal = (props: Props) => {
  const { userId, onCloseModal, onSuccess } = props;

  const [note, setNote] = useState<Types.ManualNote>(null);

  // ===== Requests ===== //
  const operatorsQuery = useGetOperatorsQuery({ fetchPolicy: 'network-only' });

  const isOperatorsLoading = operatorsQuery.loading;
  const operators = operatorsQuery.data?.operators?.content as Operator[] || [];

  const [addNote] = useCallbackAddNoteMutation();

  const [createLeadCallback] = useCreateLeadCallbackMutation();

  const createNote = async (callbackId: string) => {
    if (note) {
      await addNote({
        variables: {
          ...note,
          targetUUID: callbackId,
        },
      });
    }
  };

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValue) => {
    try {
      const responseData = await createLeadCallback({ variables: { ...values, userId } });
      const callbackId = responseData.data?.callback?.createLeadCallback?.callbackId;

      if (callbackId) {
        try {
          await createNote(callbackId);
        } catch {
          // # do nothing...
        }
      }

      Utils.EventEmitter.emit(Utils.CREATE_LEAD_CALLBACK);
      onSuccess?.();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.CREATE_MODAL.LEAD_TITLE'),
        message: I18n.t('CALLBACKS.CREATE_MODAL.SUCCESSFULLY_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CALLBACKS.CREATE_MODAL.ERROR.TITLE'),
        message: error.error === 'error.entity.already.exist'
          ? I18n.t('CALLBACKS.CREATE_MODAL.ERROR.MESSAGES.CALLBACK_EXIST')
          : I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        operatorId: '',
        callbackTime: '',
        reminder: '',
      } as FormValue}
      validate={Utils.createValidator({
        operatorId: ['required'],
        callbackTime: ['required', 'dateWithTime'],
      }, Utils.translateLabels(attributeLabels), false)}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('CALLBACKS.CREATE_MODAL.LEAD_TITLE')}
          buttonTitle={I18n.t('COMMON.BUTTONS.CREATE')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              searchable
              name="operatorId"
              className="CreateLeadCallbackModal__field"
              data-testid="CreateLeadCallbackModal-operatorIdSelect"
              component={FormikSingleSelectField}
              label={I18n.t(attributeLabels.operatorId)}
              placeholder={
                  I18n.t(isOperatorsLoading
                    ? 'COMMON.SELECT_OPTION.LOADING'
                    : 'CALLBACKS.CREATE_MODAL.SELECT_OPERATOR')
                }
              disabled={isSubmitting || isOperatorsLoading}
              options={operators.map(({ uuid, fullName, operatorStatus }) => ({
                label: fullName,
                value: uuid,
                disabled: operatorStatus !== 'ACTIVE',
              }))}
            />

            <Field
              name="callbackTime"
              className="CreateLeadCallbackModal__field"
              data-testid="CreateLeadCallbackModal-callbackTimeDatePicker"
              label={I18n.t(attributeLabels.callbackTime)}
              component={FormikDatePicker}
              withTime
              withUtc
            />

            <Field
              name="reminder"
              className="CreateLeadCallbackModal__field"
              data-testid="CreateLeadCallbackModal-reminderSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t(attributeLabels.reminder)}
              component={FormikSingleSelectField}
              options={Constants.reminderValues.map(({ value, label }) => ({
                label,
                value,
              }))}
            />

            <div className="CreateLeadCallbackModal__note">
              <NoteActionManual
                note={note}
                playerUUID={userId}
                targetUUID={userId}
                targetType={Constants.targetTypes.LEAD_CALLBACK}
                onEditSuccess={setNote}
                onDeleteSuccess={() => setNote(null)}
                placement="bottom"
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateLeadCallbackModal);
