import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, Constants, notify, Types, usePermission } from '@crm/common';
import { Button, ShortLoader, FormikSingleSelectField, FormikDatePicker } from 'components';
import { LeadCallback, Operator, Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import Modal from 'components/Modal';
import Uuid from 'components/Uuid';
import { useGetLeadCallbackQuery } from './graphql/__generated__/GetLeadCallbackQuery';
import { useGetOperatorsQuery } from './graphql/__generated__/GetOperatorsQuery';
import { useUpdateLeadCallbackMutation } from './graphql/__generated__/UpdateLeadCallbackMutation';
import { attributeLabels } from './constants';
import './UpdateLeadCallbackModal.scss';

type FormValues = {
  operatorId: string,
  callbackTime: string,
  status: CallbackStatusEnum,
  reminder: string | null,
};

export type Props = {
  callbackId: string,
  onCloseModal: () => void,
  onDelete: () => void,
  onClose?: () => void,
};

const UpdateLeadCallbackModal = (props: Props) => {
  const { callbackId, onCloseModal, onDelete, onClose } = props;

  const permission = usePermission();
  const readOnly = permission.denies(Config.permissions.LEAD_PROFILE.UPDATE_CALLBACK);

  // ===== Requests ===== //
  const leadCallbackQuery = useGetLeadCallbackQuery({ variables: { id: callbackId }, fetchPolicy: 'network-only' });

  const isCallbackLoading = leadCallbackQuery.loading;
  const leadCallback = leadCallbackQuery.data?.leadCallback as LeadCallback || {};
  const { callbackTime, operatorId, reminder, lead, status } = leadCallback;

  const operatorsQuery = useGetOperatorsQuery({ fetchPolicy: 'network-only' });

  const isOperatorsLoading = operatorsQuery.loading;
  const operators = operatorsQuery.data?.operators?.content as Operator[] || [];

  const [updateleadCallbackMutation] = useUpdateLeadCallbackMutation();

  // ===== Handlers ===== //
  const handleClose = () => {
    // Custom close function, to call useModal hook hide function for correct isOpen prop
    onClose?.();

    onCloseModal();
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await updateleadCallbackMutation({
        variables: {
          ...values,
          callbackId,
          callbackTime: moment.utc(values.callbackTime).format(Constants.DATE_TIME_BASE_FORMAT),
        },
      });

      handleClose();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.MODAL.LEAD_TITLE'),
        message: I18n.t('CALLBACKS.MODAL.SUCCESSFULLY_UPDATED'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CALLBACKS.MODAL.LEAD_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Choose>
      <When condition={isCallbackLoading}>
        <div className="UpdateLeadCallbackModal__loader">
          <ShortLoader />
        </div>
      </When>

      <Otherwise>
        <Formik
          initialValues={{
            callbackTime,
            operatorId,
            status,
            reminder: reminder || null,
          }}
          validate={
              Utils.createValidator({
                operatorId: ['required'],
                callbackTime: ['required', 'dateWithTime'],
                status: ['required'],
              }, attributeLabels, false)
            }
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, submitForm }) => (
            <Modal
              onCloseModal={handleClose}
              title={I18n.t('CALLBACKS.MODAL.LEAD_TITLE')}
              renderFooter={(
                <>
                  <If condition={permission.allows(Config.permissions.LEAD_PROFILE.DELETE_CALLBACK)}>
                    <Button
                      className="UpdateLeadCallbackModal__button--delete"
                      data-testid="UpdateLeadCallbackModal-deleteButton"
                      onClick={onDelete}
                      danger
                    >
                      {I18n.t('CALLBACKS.MODAL.DELETE_BUTTON')}
                    </Button>
                  </If>

                  <Button
                    data-testid="UpdateLeadCallbackModal-cancelButton"
                    onClick={handleClose}
                    secondary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>

                  <If condition={!readOnly}>
                    <Button
                      data-testid="UpdateLeadCallbackModal-saveChangesButton"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      type="submit"
                      primary
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </If>
                </>
              )}
            >
              <Form>
                <div className="UpdateLeadCallbackModal__lead">
                  <div className="UpdateLeadCallbackModal__callback-id">
                    {I18n.t('CALLBACKS.MODAL.CALLBACK_ID')}

                    {': '}

                    <If condition={!!callbackId}>
                      <Uuid uuid={callbackId} uuidPrefix="CB" />
                    </If>
                  </div>

                  <If condition={!!lead}>
                    <div className="UpdateLeadCallbackModal__lead-name">
                      {lead?.fullName}
                    </div>
                  </If>

                  <If condition={!!operatorId}>
                    <div className="UpdateLeadCallbackModal__lead-author">
                      {I18n.t('COMMON.AUTHOR_BY')}

                      {' '}

                      <Uuid uuid={operatorId} />
                    </div>
                  </If>
                </div>

                <Field
                  searchable
                  name="operatorId"
                  className="UpdateLeadCallbackModal__field"
                  data-testid="UpdateLeadCallbackModal-operatorIdSelect"
                  placeholder={
                      I18n.t(
                        isOperatorsLoading
                          ? 'COMMON.SELECT_OPTION.LOADING'
                          : 'CALLBACKS.MODAL.SELECT_OPERATOR',
                      )
                    }
                  label={I18n.t('CALLBACKS.MODAL.OPERATOR')}
                  component={FormikSingleSelectField}
                  disabled={isOperatorsLoading || readOnly}
                  options={operators.map(({ uuid, fullName, operatorStatus }) => ({
                    label: fullName,
                    value: uuid,
                    disabled: operatorStatus !== 'ACTIVE',
                  }))}
                />

                <Field
                  name="callbackTime"
                  className="UpdateLeadCallbackModal__field"
                  data-testid="UpdateLeadCallbackModal-callbackTimeDatePicker"
                  label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                  component={FormikDatePicker}
                  disabled={readOnly}
                  withTime
                  withUtc
                />

                <Field
                  name="status"
                  className="UpdateLeadCallbackModal__field"
                  data-testid="UpdateLeadCallbackModal-statusSelect"
                  placeholder={I18n.t('CALLBACKS.MODAL.SELECT_STATUS')}
                  label={I18n.t('CALLBACKS.MODAL.STATUS')}
                  component={FormikSingleSelectField}
                  disabled={readOnly}
                  options={Utils.enumToArray(CallbackStatusEnum).map(callbackStatus => ({
                    label: I18n.t(`CONSTANTS.CALLBACKS.${callbackStatus}`),
                    value: callbackStatus,
                  }))}
                />

                <Field
                  name="reminder"
                  data-testid="UpdateLeadCallbackModal-reminderSelect"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  label={I18n.t(attributeLabels.reminder)}
                  component={FormikSingleSelectField}
                  disabled={readOnly}
                  options={Constants.reminderValues.map(({ value, label }) => ({
                    label,
                    value,
                  }))}
                />
              </Form>
            </Modal>
          )}
        </Formik>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(UpdateLeadCallbackModal);
