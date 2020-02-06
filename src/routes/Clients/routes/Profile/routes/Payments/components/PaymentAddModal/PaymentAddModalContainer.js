import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { reduxForm, getFormValues } from 'redux-form';
import { getManualPaymentMethods } from 'graphql/queries/payments';
import { withPermission } from 'providers/PermissionsProvider';
import { createValidator } from 'utils/validator';
import { paymentTypes, attributeLabels } from './constants';
import PaymentAddModal from './PaymentAddModal';

const FORM_NAME = 'createPaymentForm';

const formValidation = (data, { newProfile: { tradingAccount }, currentValues }) => {
  let rules = {
    paymentType: 'required|string',
    amount: ['required', 'numeric', 'greater:0', 'max:999999'],
    externalReference: 'required|string',
    accountUUID: 'required|string',
  };

  if ([
    paymentTypes.WITHDRAW.name,
    paymentTypes.TRANSFER.name,
  ].includes(data.paymentType)
      && currentValues.login
      && currentValues.amount
      && Number(tradingAccount.find(({ login }) => login === currentValues.login).balance) < currentValues.amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
  }

  if ([paymentTypes.CREDIT_OUT.name].includes(data.paymentType)
    && currentValues.login
    && currentValues.amount
    && Number(tradingAccount.find(({ login }) => login === currentValues.login).credit) < currentValues.amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
  }

  if (data.paymentType === paymentTypes.DEPOSIT.name) {
    rules = { ...rules, paymentMethod: 'required|string' };
  }

  if (data.paymentType === paymentTypes.CREDIT_IN.name) {
    rules = { ...rules, expirationDate: 'required|string' };
  }

  if (data.paymentType === paymentTypes.TRANSFER.name) {
    rules = {
      ...rules,
      source: 'required|string',
      target: 'required|string',
    };

    if (currentValues
        && currentValues.source
        && currentValues.amount
        && Number(tradingAccount.find(
          ({ accountUUID }) => accountUUID === currentValues.source,
        ).balance) < currentValues.amount
    ) {
      return { source: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.MT4_NO_MONEY') };
    }

    if (currentValues
        && currentValues.source
        && currentValues.target
        && currentValues.source === currentValues.target) {
      return {
        source: I18n.t('COMMON.SOMETHING_WRONG'),
        target: I18n.t('COMMON.SOMETHING_WRONG'),
      };
    }
  } else {
    rules = { ...rules, login: 'required|numeric' };
  }

  return createValidator(rules, attributeLabels, false)(data);
};

const mapStateToProps = state => ({
  currentValues: getFormValues(FORM_NAME)(state),
});

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: FORM_NAME,
    initialValues: {
      paymentType: '',
    },
    validate: formValidation,
  }),
  withPermission,
  graphql(getManualPaymentMethods, {
    name: 'manualPaymentMethods',
  }),
)(PaymentAddModal);
