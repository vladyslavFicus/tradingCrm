import React, { PureComponent } from 'react';
import { compose, graphql } from 'react-apollo';
import { parseErrors } from 'apollo';
import { get } from 'lodash';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { generate } from 'utils/password';
import { getAvailablePlatformTypes, getAvailableAccountTypes } from 'utils/tradingAccount';
import { getActiveBrandConfig } from 'config';
import { createTradingAccountMutation } from 'graphql/mutations/tradingAccount';
import { InputField, NasSelectField } from 'components/ReduxForm';
import PropTypes from 'constants/propTypes';
import { attributeLabels } from './constants';
import './TradingAccountAddModal.scss';

class TradingAccountAddModal extends PureComponent {
  static propTypes = {
    profileId: PropTypes.string.isRequired,
    accountType: PropTypes.string,
    platformType: PropTypes.string,
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
    accountType: null,
    platformType: null,
    error: null,
    onConfirm: () => {},
  };

  constructor(props) {
    super(props);

    // Set first platformType to form from list and set LIVE accountType if it exist for chosen platformType
    const platformType = get(getAvailablePlatformTypes(), '0.value');
    const accountTypes = getAvailableAccountTypes(platformType);
    const accountType = accountTypes.find(type => get(type, 'value') === 'LIVE') ? 'LIVE' : 'DEMO';

    this.props.change('platformType', platformType);
    this.props.change('accountType', accountType);
  }

  onSubmit = async (data) => {
    const { profileId, createTradingAccount, notify, onCloseModal, onConfirm } = this.props; // eslint-disable-line

    try {
      await createTradingAccount({
        variables: {
          ...data,
          profileId,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED'),
      });

      onCloseModal();
      onConfirm();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
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
      accountType,
      platformType,
    } = this.props;

    const platformTypes = getAvailablePlatformTypes();
    const accountTypes = getAvailableAccountTypes(platformType);

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
          <If condition={platformTypes.length > 1}>
            <Field
              name="platformType"
              component={NasSelectField}
              label={attributeLabels.platformType}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              searchable={false}
              onFieldChange={(value) => {
                this.props.change('platformType', value);

                const availableAccountTypes = getAvailableAccountTypes(value);

                // If previous accountType not found for new chosen platformType --> choose first from list
                if (!availableAccountTypes.find(type => get(type, 'value') === accountType)) {
                  this.props.change('accountType', get(availableAccountTypes, '0.value'));
                }
              }}
            >
              {platformTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Field>
          </If>
          <If condition={accountTypes.length > 1}>
            <Field
              name="accountType"
              component={NasSelectField}
              label={attributeLabels.accountType}
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
          </If>
          <If condition={accountType === 'DEMO'}>
            <Field
              name="amount"
              component={NasSelectField}
              label={attributeLabels.amount}
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
  platformType: selector(state, 'platformType'),
});

export default compose(
  withNotifications,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_NAME,
    initialValues: {
      password: generate(),
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
