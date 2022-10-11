import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { FormikInputField } from 'components/Formik';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import './ChangePasswordModal.scss';

const attributeLabels = {
  newPassword: 'MODALS.CHANGE_PASSWORD_MODAL.NEW_PASSWORD',
  repeatPassword: 'MODALS.CHANGE_PASSWORD_MODAL.REPEAT_PASSWORD',
};

class ChangePasswordModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    fullName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    passwordPattern: PropTypes.string,
    passwordMaxSize: PropTypes.number,
    passwordCustomError: PropTypes.string,
  };

  static defaultProps = {
    passwordPattern: null,
    passwordMaxSize: null,
    passwordCustomError: null,
  };

  onHandleSubmit = async (values, { setSubmitting }) => {
    const { onSubmit } = this.props;

    onSubmit(values);
    setSubmitting(false);
  };

  render() {
    const {
      onCloseModal,
      fullName,
      uuid,
      passwordPattern,
      passwordMaxSize,
      passwordCustomError,
    } = this.props;

    return (
      <Modal className="ChangePasswordModal" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{}}
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
          onSubmit={this.onHandleSubmit}
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
                    {I18n.t('COMMON.FOR')}
                    {` ${fullName} - `}
                    <Uuid className="ChangePasswordModal__uuid" uuid={uuid} />
                  </div>
                </div>
                <Field
                  name="newPassword"
                  type="password"
                  label={I18n.t(attributeLabels.newPassword)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="repeatPassword"
                  type="password"
                  label={I18n.t(attributeLabels.repeatPassword)}
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
  }
}

export default ChangePasswordModal;
