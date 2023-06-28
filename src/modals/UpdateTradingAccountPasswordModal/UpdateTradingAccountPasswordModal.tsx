import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { FormikInputField } from 'components/Formik/index';
import { createValidator, translateLabels } from 'utils/validator';
import { useUpdateTradingAccountPasswordMutation } from './graphql/__generated__/UpdateTradingAccountPasswordMutation';
import './UpdateTradingAccountPasswordModal.scss';

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
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.SUCCESSFULLY_CHANGED'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal className="UpdateTradingAccountPasswordModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ password: '', repeatPassword: '' }}
        validate={createValidator({
          password: ['required', `regex:${getBrand().password.mt4_pattern}`],
          repeatPassword: ['required', 'same:password'],
        }, translateLabels(attributeLabels), false)}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal} className="UpdateTradingAccountPasswordModal__header">
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login })}
            </ModalHeader>

            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid="UpdateTradingAccountPasswordModal-cancelButton"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                data-testid="UpdateTradingAccountPasswordModal-saveNewPasswordButton"
                disabled={isSubmitting}
                type="submit"
                danger
              >
                {I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateTradingAccountPasswordModal);
