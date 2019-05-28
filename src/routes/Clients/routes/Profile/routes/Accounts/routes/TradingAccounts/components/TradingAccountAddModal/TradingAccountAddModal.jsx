import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from 'utils/validator';
import { generate } from 'utils/password';
import { getActiveBrandConfig } from 'config';
import { InputField, NasSelectField } from 'components/ReduxForm';
import PropTypes from 'constants/propTypes';
import { accountTypes as accountTypesList, attributeLabels } from './constants';
import './TradingAccountAddModal.scss';

class TradingAccountAddModal extends PureComponent {
  static propTypes = {
    profileId: PropTypes.string.isRequired,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    accountTypes: PropTypes.array,
    currency: PropTypes.string,
    change: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    createTradingAccount: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
    accountTypes: accountTypesList,
    currency: null,
    onConfirm: () => {},
  };

  onSubmit = async (data) => {
    const { profileId, createTradingAccount, notify, onCloseModal, onConfirm, currency } = this.props;

    const { data: { tradingAccount: { create: { success } } } } = await createTradingAccount({
      variables: {
        ...data,
        currency,
        profileId,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
      message: success
        ? I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      onCloseModal();
      onConfirm();
    }
  };

  handleGeneratePassword = () => {
    this.props.change('password', generate());
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      submitting,
      invalid,
      accountTypes,
      error,
    } = this.props;

    return (
      <Modal contentClassName="trading-account-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE')}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="trading-account-add-modal-form"
          onSubmit={handleSubmit(this.onSubmit)}
        >
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <Field
            name="name"
            type="text"
            label={I18n.t(attributeLabels.name)}
            component={InputField}
          />
          <Field
            name="password"
            type="text"
            onIconClick={this.handleGeneratePassword}
            inputAddon={<span className="icon-generate-password" />}
            inputAddonPosition="right"
            label={I18n.t(attributeLabels.password)}
            component={InputField}
          />
        </ModalBody>
        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <button
                  type="reset"
                  className="btn btn-default-outline text-uppercase"
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.CANCEL')}
                </button>
                <button
                  disabled={invalid || submitting}
                  type="submit"
                  className="btn btn-primary text-uppercase margin-left-25"
                  form="trading-account-add-modal-form"
                >
                  {I18n.t('COMMON.CONFIRM')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

const FORM_NAME = 'createTradingAccountAccountForm';

const TradingAccountAddModalRedux = reduxForm({
  form: FORM_NAME,
  initialValues: {
    mode: 'live',
    password: generate(),
  },
  validate: createValidator({
    name: ['required', 'string', 'max:25', 'min:4'],
    mode: ['required', 'string'],
    currency: ['required', 'string'],
    password: ['required', `regex:${getActiveBrandConfig().password.mt4_pattern}`],
  }, translateLabels(attributeLabels)),
})(TradingAccountAddModal);

export default TradingAccountAddModalRedux;
