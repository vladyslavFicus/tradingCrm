import React from 'react';
import compose from 'compose-function';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import { LeadCallback, Operator, Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import { callbacksStatuses, reminderValues } from 'constants/callbacks';
import { targetTypes } from 'constants/note';
import { createValidator } from 'utils/validator';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { FormikSelectField, FormikDatePicker } from 'components/Formik';
import { Button } from 'components/UI';
import ShortLoader from 'components/ShortLoader';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useGetLeadCallbackQuery } from './graphql/__generated__/GetLeadCallbackQuery';
import { useGetOperatorsQuery } from './graphql/__generated__/GetOperatorsQuery';
import { useUpdateLeadCallbackMutation } from './graphql/__generated__/UpdateLeadCallbackMutation';
import './LeadCallbackDetailsModal.scss';

const attributeLabels = {
  operatorId: I18n.t('CALLBACKS.MODAL.OPERATOR'),
  callbackTime: I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME'),
  status: I18n.t('CALLBACKS.MODAL.STATUS'),
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

type Props = {
  callbackId: string,
  notify: Notify,
  onCloseModal: () => void,
};

type FormValues = {
  operatorId: string,
  callbackTime: string,
  status: CallbackStatusEnum,
  reminder: string | null,
}

const LeadCallbackDetailsModal = (props: Props) => {
  const { notify, onCloseModal, callbackId } = props;
  const [updateleadCallbackMutation] = useUpdateLeadCallbackMutation();

  const permission = usePermission();
  const readOnly = permission.denies(permissions.LEAD_PROFILE.UPDATE_CALLBACK);

  // lead Callback Query
  const leadCallbackQuery = useGetLeadCallbackQuery({
    variables: { id: callbackId },
    fetchPolicy: 'network-only',
  });
  const isCallbackLoading = leadCallbackQuery.loading;
  const leadCallback = leadCallbackQuery.data?.leadCallback as LeadCallback || {};
  const { callbackTime, operatorId, reminder, lead, status, userId, note } = leadCallback;

  // Operators Query
  const operatorsQuery = useGetOperatorsQuery({ fetchPolicy: 'network-only' });
  const isOperatorsLoading = operatorsQuery.loading;
  const operators = operatorsQuery.data?.operators?.content as Operator[] || [];

  const handleSubmit = async (values: FormValues) => {
    try {
      await updateleadCallbackMutation({
        variables: {
          ...values,
          callbackId,
          callbackTime: moment(values.callbackTime).utc().format(DATE_TIME_BASE_FORMAT),
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.MODAL.LEAD_TITLE'),
        message: I18n.t('CALLBACKS.MODAL.SUCCESSFULLY_UPDATED'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.MODAL.LEAD_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="LeadCallbackDetailsModal" toggle={onCloseModal} isOpen>
      <ModalHeader
        className="LeadCallbackDetailsModal__header"
        toggle={onCloseModal}
      >
        {I18n.t('CALLBACKS.MODAL.LEAD_TITLE')}
      </ModalHeader>

      <Choose>
        <When condition={isCallbackLoading}>
          <div className="LeadCallbackDetailsModal__loader">
            <ShortLoader />
          </div>
        </When>
        <Otherwise>
          <Formik
            initialValues={{
              callbackTime: moment.utc(callbackTime).local().format(DATE_TIME_BASE_FORMAT),
              operatorId,
              status,
              reminder: reminder || null,
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
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <div className="LeadCallbackDetailsModal__lead">
                    <div className="LeadCallbackDetailsModal__callback-id">
                      {I18n.t('CALLBACKS.MODAL.CALLBACK_ID')}: <Uuid uuid={callbackId} uuidPrefix="CB" />
                    </div>

                    <If condition={!!lead}>
                      <div className="LeadCallbackDetailsModal__lead-name">
                        {lead?.fullName}
                      </div>
                    </If>

                    <div className="LeadCallbackDetailsModal__lead-author">
                      {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={operatorId} />
                    </div>
                  </div>

                  <Field
                    name="operatorId"
                    className="LeadCallbackDetailsModal__field"
                    placeholder={
                      I18n.t(
                        isOperatorsLoading
                          ? 'COMMON.SELECT_OPTION.LOADING'
                          : 'CALLBACKS.MODAL.SELECT_OPERATOR',
                      )
                    }
                    label={I18n.t('CALLBACKS.MODAL.OPERATOR')}
                    component={FormikSelectField}
                    disabled={isOperatorsLoading || readOnly}
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
                    className="LeadCallbackDetailsModal__field"
                    label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                    component={FormikDatePicker}
                    disabled={readOnly}
                    withTime
                  />

                  <Field
                    name="status"
                    className="LeadCallbackDetailsModal__field"
                    placeholder={I18n.t('CALLBACKS.MODAL.SELECT_STATUS')}
                    label={I18n.t('CALLBACKS.MODAL.STATUS')}
                    component={FormikSelectField}
                    disabled={readOnly}
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
                    disabled={readOnly}
                  >
                    {reminderValues.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Field>

                  <If condition={!readOnly}>
                    <div className="LeadCallbackDetailsModal__notes">
                      <NoteButton
                        id={`callback-details-note-${callbackId}`}
                        playerUUID={userId}
                        targetUUID={callbackId}
                        targetType={targetTypes.LEAD_CALLBACK}
                        note={note}
                      />
                    </div>
                  </If>
                </ModalBody>

                <ModalFooter>
                  <Button
                    onClick={onCloseModal}
                    secondary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>

                  <If condition={!readOnly}>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      primary
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </If>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Otherwise>
      </Choose>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(LeadCallbackDetailsModal);
