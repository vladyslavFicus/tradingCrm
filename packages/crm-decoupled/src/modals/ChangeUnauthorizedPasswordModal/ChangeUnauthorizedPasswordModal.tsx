import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Utils, Constants, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField } from 'components';
import Modal from 'components/Modal';
import { useChangeUnauthorizedPasswordMutation } from './graphql/__generated__/ChangeUnauthorizedPasswordMutation';
import './ChangeUnauthorizedPasswordModal.scss';

const fieldLabels = {
  currentPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.CURRENT_PASSWORD',
  newPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NEW_PASSWORD',
  repeatPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.REPEAT_PASSWORD',
};

const customErrors = {
  'regex.newPassword': Constants.Operator.passwordCustomError,
};

type FormValues = {
  currentPassword: string,
  newPassword: string,
  repeatPassword: string,
};

export type Props = {
  uuid: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const ChangeUnauthorizedPasswordModal = (props: Props) => {
  const { uuid, onSuccess, onCloseModal } = props;

  const [formError, setFormError] = useState<string | null>(null);

  // ===== Requests ===== //
  const [changeUnauthorizedPassword] = useChangeUnauthorizedPasswordMutation();

  // ===== Handlers ===== //
  const onHandleSubmit = async (values: FormValues) => {
    try {
      await changeUnauthorizedPassword({ variables: { uuid, ...values } });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (
        error.error === 'error.validation.password.repeated'
        || error.error === 'error.validation.password.nonEquals'
      ) {
        setFormError(I18n.t(error.error));
      } else {
        setFormError(null);

        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
      }}
      validate={
          Utils.createValidator({
            currentPassword: ['required'],
            newPassword: [
              'required',
              `regex:${Constants.Operator.passwordPattern}`,
              `max:${Constants.Operator.passwordMaxSize}`,
            ],
            repeatPassword: ['required', 'same:newPassword'],
          }, Utils.translateLabels(fieldLabels), false, customErrors)
        }
      onSubmit={onHandleSubmit}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => (
        <Modal
          warning
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.TITLE')}
          disabled={!dirty || !isValid || isSubmitting}
          styleButton="danger"
          buttonTitle={I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
          clickSubmit={submitForm}
        >
          <Form>
            <If condition={!!formError}>
              <div className="ChangeUnauthorizedPasswordModal__error">
                {formError}
              </div>
            </If>

            <div className="ChangeUnauthorizedPasswordModal__subtitle">
              {I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.SUBTITLE')}
            </div>

            <Field
              name="currentPassword"
              type="password"
              label={I18n.t(fieldLabels.currentPassword)}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="newPassword"
              type="password"
              label={I18n.t(fieldLabels.newPassword)}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="repeatPassword"
              type="password"
              label={I18n.t(fieldLabels.repeatPassword)}
              component={FormikInputField}
              disabled={isSubmitting}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(ChangeUnauthorizedPasswordModal);
