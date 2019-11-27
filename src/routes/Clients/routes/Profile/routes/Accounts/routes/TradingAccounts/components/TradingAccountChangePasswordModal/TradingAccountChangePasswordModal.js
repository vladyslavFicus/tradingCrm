import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { InputField } from '../../../../../../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../../../../../../utils/validator';
import { getActiveBrandConfig } from '../../../../../../../../../../config';
import attributeLabels from './constants';

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
      login,
      notify,
      onCloseModal,
      tradingAccountChangePassword,
    } = this.props;

    const { data: { tradingAccount: { changePassword: { success } } } } = await tradingAccountChangePassword({
      variables: {
        login,
        password,
      },
    });

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

export default reduxForm({
  form: 'tradingAccountChangePassword',
  validate: createValidator({
    password: ['required', `regex:${getActiveBrandConfig().password.mt4_pattern}`],
    repeatPassword: [
      'required',
      'same:password',
    ],
  }, translateLabels(attributeLabels)),
})(TradingAccountChangePasswordModal);
