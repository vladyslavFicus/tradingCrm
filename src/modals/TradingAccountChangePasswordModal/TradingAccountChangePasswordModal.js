import React, { PureComponent } from 'react';
import compose from 'compose-function';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { Button } from 'components/UI';
import { FormikInputField } from 'components/Formik/index';
import { createValidator, translateLabels } from 'utils/validator';
import TradingAccountChangePasswordMutation from './graphql/TradingAccountChangePasswordMutation';

const attributeLabels = {
  password: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.NEW_PASSWORD'),
  repeatPassword: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.REPEAT_PASSWORD'),
};

class TradingAccountChangePasswordModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
    tradingAccountChangePassword: PropTypes.func.isRequired,
    login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    accountUUID: PropTypes.string.isRequired,
    profileUUID: PropTypes.string.isRequired,
  };

  onSubmit = async ({ password }, { setSubmitting }) => {
    const {
      onCloseModal,
      notify,
      tradingAccountChangePassword,
      login,
      accountUUID,
      profileUUID,
    } = this.props;

    try {
      await tradingAccountChangePassword({
        variables: {
          accountUUID,
          profileUUID,
          password,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.SUCCESSFULLY_CHANGED'),
      });

      onCloseModal();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      login,
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal className="modal-danger" toggle={onCloseModal} isOpen={isOpen}>
        <Formik
          initialValues={{
            password: '',
            repeatPassword: '',
          }}
          validate={createValidator({
            password: ['required', `regex:${getBrand().password.mt4_pattern}`],
            repeatPassword: ['required', 'same:password'],
          }, translateLabels(attributeLabels), false)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login })}
              </ModalHeader>
              <ModalBody>
                <Field
                  name="password"
                  type="password"
                  label={attributeLabels.password}
                  placeholder={attributeLabels.password}
                  component={FormikInputField}
                />
                <Field
                  name="repeatPassword"
                  type="password"
                  label={attributeLabels.repeatPassword}
                  placeholder={attributeLabels.repeatPassword}
                  component={FormikInputField}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  commonOutline
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
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
  }
}

export default compose(
  withNotifications,
  withRequests({
    tradingAccountChangePassword: TradingAccountChangePasswordMutation,
  }),
)(TradingAccountChangePasswordModal);
