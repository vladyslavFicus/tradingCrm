import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, notify, Types } from '@crm/common';
import { FormikInputField } from 'components';
import Modal from 'components/Modal';
import { useUpdateTradingAccountPasswordMutation } from './graphql/__generated__/UpdateTradingAccountPasswordMutation';

const attributeLabels = {
  password: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.NEW_PASSWORD'),
  repeatPassword: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.REPEAT_PASSWORD'),
};

type FormValues = {
  password: string,
  repeatPassword: string,
};

export type Props = {
  login: string | number,
  accountUUID: string,
  profileUUID: string,
  onCloseModal: () => void,
};

const UpdateTradingAccountPasswordModal = (props: Props) => {
  const { login, accountUUID, profileUUID, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateTradingAccountPasswordMutation] = useUpdateTradingAccountPasswordMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ password }: FormValues) => {
    try {
      await updateTradingAccountPasswordMutation({ variables: { accountUUID, profileUUID, password } });

      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.SUCCESSFULLY_CHANGED'),
      });
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Formik
      initialValues={{ password: '', repeatPassword: '' }}
      validate={Utils.createValidator({
        password: ['required', `regex:${Config.getBrand().password.mt4_pattern}`],
        repeatPassword: ['required', 'same:password'],
      }, Utils.translateLabels(attributeLabels), false)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          warning
          onCloseModal={onCloseModal}
          title={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login })}
          buttonTitle={I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="password"
              type="password"
              data-testid="UpdateTradingAccountPasswordModal-passwordInput"
              label={attributeLabels.password}
              placeholder={attributeLabels.password}
              component={FormikInputField}
            />

            <Field
              name="repeatPassword"
              type="password"
              data-testid="UpdateTradingAccountPasswordModal-repeatPasswordInput"
              label={attributeLabels.repeatPassword}
              placeholder={attributeLabels.repeatPassword}
              component={FormikInputField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateTradingAccountPasswordModal);
