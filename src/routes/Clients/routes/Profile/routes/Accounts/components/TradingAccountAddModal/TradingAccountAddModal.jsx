import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { createValidator } from 'utils/validator';
import { generate } from 'utils/password';
import { getActiveBrandConfig } from 'config';
import { createTradingAccountMutation } from 'graphql/mutations/tradingAccount';
import { InputField, NasSelectField } from 'components/ReduxForm';
import { withNotifications } from 'components/HighOrder';
import PropTypes from 'constants/propTypes';
import { accountTypes } from 'constants/accountTypes';
import { attributeLabels } from './constants';
import './TradingAccountAddModal.scss';

class TradingAccountAddModal extends PureComponent {
  static propTypes = {
    profileId: PropTypes.string.isRequired,
    accountType: PropTypes.string,
    error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
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
    accountType: 'LIVE',
    error: null,
    onConfirm: () => {},
  };

  onSubmit = async (data) => {
    const { profileId, createTradingAccount, notify, onCloseModal, onConfirm } = this.props;

    const { data: { tradingAccount: { create: { success, error } } } } = await createTradingAccount({
      variables: {
        ...data,
        profileId,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
      message: success
        ? I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED')
        : I18n.t(error.error) || I18n.t('COMMON.SOMETHING_WRONG'),
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
          <If condition={getActiveBrandConfig().isDemoAvailable}>
            <Field
              name="accountType"
              component={NasSelectField}
              label="Account Type"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              searchable={false}
              onFieldChange={(value) => {
                this.props.change('accountType', value);
              }}
            >
              {accountTypes.map(({ value, label }) => (
                <option key={value} value={value}>{I18n.t(label)}</option>
              ))}
            </Field>
            <If condition={this.props.accountType === 'DEMO'}>
              <Field
                name="amount"
                component={NasSelectField}
                label="Amount"
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                searchable={false}
              >
                {[100, 500, 1000, 5000, 10000, 50000, 100000].map(value => (
                  <option key={value} value={value}>
                    {I18n.toNumber(value, { precision: 0 })}
                  </option>
                ))}
              </Field>
            </If>
          </If>
          <Field
            name="name"
            type="text"
            label={attributeLabels.name}
            component={InputField}
          />
          <Field
            name="currency"
            component={NasSelectField}
            label={attributeLabels.currency}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            searchable={false}
          >
            {getActiveBrandConfig().currencies.supported.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </Field>
          <Field
            name="password"
            type="text"
            onIconClick={this.handleGeneratePassword}
            inputAddon={<span className="icon-generate-password" />}
            inputAddonPosition="right"
            label={attributeLabels.password}
            component={InputField}
          />
        </ModalBody>
        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <button
                  type="button"
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

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
  accountType: selector(state, 'accountType'),
});

export default compose(
  withNotifications,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_NAME,
    initialValues: {
      password: generate(),
      accountType: 'LIVE',
    },
    validate: values => createValidator({
      name: ['required', 'string', 'max:50', 'min:4'],
      currency: ['required', 'string'],
      password: ['required', `regex:${getActiveBrandConfig().password.mt4_pattern}`],
      amount: values.accountType === 'DEMO' && 'required',
    }, attributeLabels)(values),
  }),
  graphql(createTradingAccountMutation, { name: 'createTradingAccount' }),
)(TradingAccountAddModal);