import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { getActiveBrandConfig } from 'config';
import { FormikInputField } from 'components/Formik';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import './ChangePasswordModal.scss';

const fieldLabels = {
  newPasswordLabel: 'MODALS.CHANGE_PASSWORD_MODAL.NEW_PASSWORD',
  repeatPasswordLabel: 'MODALS.CHANGE_PASSWORD_MODAL.REPEAT_PASSWORD',
};

class ChangePasswordModal extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    fullName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  };

  onHandleSubmit = async (values, { setSubmitting, validateForm }) => {
    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (!hasValidationErrors) {
      this.props.onSubmit(values);
    }

    setSubmitting(false);
  };

  render() {
    const { onClose, fullName, uuid } = this.props;

    return (
      <Modal className="ChangePasswordModal" toggle={onClose} isOpen>
        <Formik
          initialValues={{ password: '', repeatPassword: '' }}
          validate={
            createValidator(
              {
                password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
                repeatPassword: ['required', 'same:password'],
              },
              fieldLabels,
              false,
            )
          }
          onSubmit={this.onHandleSubmit}
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form>
              <ModalHeader
                className="ChangePasswordModal__header"
                toggle={onClose}
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
                  name="password"
                  type="password"
                  label={I18n.t(fieldLabels.newPasswordLabel)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="repeatPassword"
                  type="password"
                  label={I18n.t(fieldLabels.repeatPasswordLabel)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onClose}
                  commonOutline
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
  }
}

export default ChangePasswordModal;
