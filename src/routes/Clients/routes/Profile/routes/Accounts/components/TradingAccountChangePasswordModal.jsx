import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { getActiveBrandConfig } from 'config';
import { withNotifications } from 'hoc';
import { tradingAccountChangePasswordMutation } from 'graphql/mutations/tradingAccount';
import { InputField } from 'components/ReduxForm';
import { createValidator, translateLabels } from 'utils/validator';

const attributeLabels = {
  newPasswordLabel: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.NEW_PASSWORD'),
  repeatPasswordLabel: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.REPEAT_PASSWORD'),
};

class TradingAccountChangePasswordModal extends PureComponent {
  static propTypes = {
    login: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    tradingAccountChangePassword: PropTypes.func.isRequired,
  };

  onSubmit = async ({ password }) => {
    const {
      accountUUID,
      profileUUID,
      notify,
      login,
      onCloseModal,
      tradingAccountChangePassword,
    } = this.props;

    const response = await tradingAccountChangePassword({
      variables: {
        accountUUID,
        profileUUID,
        password,
      },
    });

    const success = get(response, 'data.tradingAccount.changePassword.success') || false;

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login }),
      message: success
        ? I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.SUCCESSFULLY_CHANGED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      onCloseModal();
    }
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      handleSubmit,
      login,
      invalid,
      submitting,
    } = this.props;

    return (
      <Modal className="modal-danger" toggle={onCloseModal} isOpen={isOpen}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <ModalHeader toggle={onCloseModal}>
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CHANGE_PASSWORD.TITLE', { login })}
          </ModalHeader>
          <ModalBody>
            <Field
              name="password"
              type="password"
              label={attributeLabels.newPasswordLabel}
              component={InputField}
            />
            <Field
              name="repeatPassword"
              type="password"
              label={attributeLabels.repeatPasswordLabel}
              component={InputField}
            />
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-default-outline"
              onClick={onCloseModal}
            >
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
            <button
              className="btn btn-danger"
              disabled={invalid || submitting}
              type="submit"
            >
              {I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  graphql(tradingAccountChangePasswordMutation, { name: 'tradingAccountChangePassword' }),
  reduxForm({
    form: 'tradingAccountChangePassword',
    validate: createValidator({
      password: ['required', `regex:${getActiveBrandConfig().password.mt4_pattern}`],
      repeatPassword: [
        'required',
        'same:password',
      ],
    }, translateLabels(attributeLabels)),
  }),
)(TradingAccountChangePasswordModal);
