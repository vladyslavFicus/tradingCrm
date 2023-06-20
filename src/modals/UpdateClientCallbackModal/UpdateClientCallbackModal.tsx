import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { ClientCallback, Operator, Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';
import { reminderValues } from 'constants/callbacks';
import enumToArray from 'utils/enumToArray';
import { createValidator } from 'utils/validator';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { FormikSelectField, FormikDatePicker } from 'components/Formik';
import { Button } from 'components/Buttons';
import ShortLoader from 'components/ShortLoader';
import Uuid from 'components/Uuid';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { useGetClientCallbackQuery } from './graphql/__generated__/GetClientCallbackQuery';
import { useGetOperatorsQuery } from './graphql/__generated__/GetOperatorsQuery';
import { useUpdateClientCallbackMutation } from './graphql/__generated__/UpdateClientCallbackMutation';
import './UpdateClientCallbackModal.scss';

const attributeLabels = {
  operatorId: I18n.t('CALLBACKS.MODAL.OPERATOR'),
  callbackTime: I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME'),
  status: I18n.t('CALLBACKS.MODAL.STATUS'),
  reminder: 'CALLBACKS.CREATE_MODAL.REMINDER',
};

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

const UpdateClientCallbackModal = (props: Props) => {
  const { callbackId, onDelete, onCloseModal, onClose } = props;

  const permission = usePermission();
  const readOnly = permission.denies(permissions.USER_PROFILE.UPDATE_CALLBACK);

  // ===== Requests ===== //
  const clientCallbackQuery = useGetClientCallbackQuery({ variables: { id: callbackId }, fetchPolicy: 'network-only' });

  const isCallbackLoading = clientCallbackQuery.loading;
  const clientCallback = clientCallbackQuery.data?.clientCallback as ClientCallback || {};
  const { callbackTime, operatorId, reminder, client, status } = clientCallback;

  const operatorsQuery = useGetOperatorsQuery({ fetchPolicy: 'network-only' });

  const isOperatorsLoading = operatorsQuery.loading;
  const operators = operatorsQuery.data?.operators?.content as Operator[] || [];

  const [updateClientCallbackMutation] = useUpdateClientCallbackMutation();

  // ===== Handlers ===== //
  const handleClose = () => {
    // Custom close function, to call useModal hook hide function for correct isOpen prop
    onClose?.();

    onCloseModal();
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await updateClientCallbackMutation({
        variables: {
          ...values,
          callbackId,
          callbackTime: moment.utc(values.callbackTime).format(DATE_TIME_BASE_FORMAT),
        },
      });

      handleClose();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.MODAL.CLIENT_TITLE'),
        message: I18n.t('CALLBACKS.MODAL.SUCCESSFULLY_UPDATED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.MODAL.CLIENT_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="UpdateClientCallbackModal" toggle={handleClose} isOpen>
      <ModalHeader
        className="UpdateClientCallbackModal__header"
        toggle={handleClose}
      >
        {I18n.t('CALLBACKS.MODAL.CLIENT_TITLE')}
      </ModalHeader>

      <Choose>
        <When condition={isCallbackLoading}>
          <div className="UpdateClientCallbackModal__loader">
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
                  <div className="UpdateClientCallbackModal__client">
                    <div className="UpdateClientCallbackModal__callback-id">
                      {I18n.t('CALLBACKS.MODAL.CALLBACK_ID')}

                      {': '}

                      <If condition={!!callbackId}>
                        <Uuid uuid={callbackId} uuidPrefix="CB" />
                      </If>
                    </div>

                    <If condition={!!client}>
                      <div className="UpdateClientCallbackModal__client-name">
                        {client?.fullName}
                      </div>
                    </If>

                    <If condition={!!operatorId}>
                      <div className="UpdateClientCallbackModal__client-author">
                        {I18n.t('COMMON.AUTHOR_BY')}

                        {' '}

                        <Uuid uuid={operatorId} />
                      </div>
                    </If>
                  </div>

                  <Field
                    name="operatorId"
                    className="UpdateClientCallbackModal__field"
                    data-testid="UpdateClientCallbackModal-operatorIdSelect"
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
                    className="UpdateClientCallbackModal__field"
                    data-testid="UpdateClientCallbackModal-callbackTimeDatePicker"
                    label={I18n.t('CALLBACKS.MODAL.CALLBACK_DATE_AND_TIME')}
                    component={FormikDatePicker}
                    disabled={readOnly}
                    withTime
                    withUtc
                  />

                  <Field
                    name="status"
                    className="UpdateClientCallbackModal__field"
                    data-testid="UpdateClientCallbackModal-statusSelect"
                    placeholder={I18n.t('CALLBACKS.MODAL.SELECT_STATUS')}
                    label={I18n.t('CALLBACKS.MODAL.STATUS')}
                    component={FormikSelectField}
                    disabled={readOnly}
                  >
                    {enumToArray(CallbackStatusEnum).map(callbackStatus => (
                      <option key={callbackStatus} value={callbackStatus}>
                        {I18n.t(`CONSTANTS.CALLBACKS.${callbackStatus}`)}
                      </option>
                    ))}
                  </Field>

                  <Field
                    name="reminder"
                    data-testid="UpdateClientCallbackModal-reminderSelect"
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
                </ModalBody>

                <ModalFooter>
                  <If condition={permission.allows(permissions.USER_PROFILE.DELETE_CALLBACK)}>
                    <Button
                      className="UpdateClientCallbackModal__button--delete"
                      data-testid="UpdateClientCallbackModal-deleteButton"
                      onClick={onDelete}
                      danger
                    >
                      {I18n.t('CALLBACKS.MODAL.DELETE_BUTTON')}
                    </Button>
                  </If>

                  <Button
                    data-testid="UpdateClientCallbackModal-cancelButton"
                    onClick={handleClose}
                    secondary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>

                  <If condition={!readOnly}>
                    <Button
                      data-testid="UpdateClientCallbackModal-saveChangesButton"
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

export default React.memo(UpdateClientCallbackModal);
