import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { getBrand } from 'config';
import { FormikInputField } from 'components/Formik';
import Uuid from 'components/Uuid';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import { attributeLabels } from './constants';
import './ChangePasswordModal.scss';

export type FormValues = {
  newPassword: string,
  repeatPassword: string,
};

export type Props = {
  onCloseModal: () => void,
  onSubmit: (values: FormValues) => void,
  fullName: string,
  uuid: string,
  passwordPattern?: string,
  passwordMaxSize?: number,
  passwordCustomError?: string,
};

const ChangePasswordModal = (props: Props) => {
  const {
    onCloseModal,
    onSubmit,
    fullName,
    uuid,
    passwordPattern,
    passwordMaxSize,
    passwordCustomError,
  } = props;

  const onHandleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Modal className="ChangePasswordModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          newPassword: '',
          repeatPassword: '',
        } as FormValues}
        validate={
            createValidator(
              {
                newPassword: [
                  'required',
                  `regex:${passwordPattern || getBrand().password.pattern}`,
                  ...[passwordMaxSize && `max:${passwordMaxSize}`],
                ],
                repeatPassword: ['required', 'same:newPassword'],
              },
              translateLabels(attributeLabels),
              false,
              {
                ...passwordCustomError && { 'regex.newPassword': passwordCustomError },
              },
            )
          }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onHandleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form>
            <ModalHeader
              className="ChangePasswordModal__header"
              toggle={onCloseModal}
            >
              {I18n.t('MODALS.CHANGE_PASSWORD_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
              <div className="ChangePasswordModal__subtitle">
                <div className="ChangePasswordModal__subtitle-text">
                  {I18n.t('MODALS.CHANGE_PASSWORD_MODAL.SUBTITLE')}
                </div>

                <div className="ChangePasswordModal__subtitle-text">
                  {`${I18n.t('COMMON.FOR')} ${fullName} - `}

                  <Uuid className="ChangePasswordModal__uuid" uuid={uuid} />
                </div>
              </div>

              <Field
                name="newPassword"
                type="password"
                label={I18n.t(attributeLabels.newPassword)}
                component={FormikInputField}
                classNameError="ChangePasswordModal__error"
                disabled={isSubmitting}
              />

              <Field
                name="repeatPassword"
                type="password"
                label={I18n.t(attributeLabels.repeatPassword)}
                component={FormikInputField}
                classNameError="ChangePasswordModal__error"
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
                disabled={!dirty || isSubmitting}
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

export default React.memo(ChangePasswordModal);
