import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { passwordCustomError, passwordMaxSize, passwordPattern } from 'constants/operators';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import { useChangeUnauthorizedPasswordMutation } from './graphql/__generated__/ChangeUnauthorizedPasswordMutation';
import './ChangeUnauthorizedPasswordModal.scss';

const fieldLabels = {
  currentPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.CURRENT_PASSWORD',
  newPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NEW_PASSWORD',
  repeatPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.REPEAT_PASSWORD',
};

const customErrors = {
  'regex.newPassword': passwordCustomError,
};

type FormValues = {
  currentPassword: string,
  newPassword: string,
  repeatPassword: string,
};

type Props = {
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
        level: LevelType.SUCCESS,
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
          level: LevelType.ERROR,
          title: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    }
  };

  return (
    <Modal className="ChangeUnauthorizedPasswordModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          repeatPassword: '',
        }}
        validate={
          createValidator({
            currentPassword: ['required'],
            newPassword: [
              'required',
              `regex:${passwordPattern}`,
              `max:${passwordMaxSize}`,
            ],
            repeatPassword: ['required', 'same:newPassword'],
          }, translateLabels(fieldLabels), false, customErrors)
        }
        onSubmit={onHandleSubmit}
      >
        {({ dirty, isValid, isSubmitting }) => (
          <Form>
            <ModalHeader
              className="ChangeUnauthorizedPasswordModal__header"
              toggle={onCloseModal}
            >
              {I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                danger
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
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

export default React.memo(ChangeUnauthorizedPasswordModal);
