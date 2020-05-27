import I18n from 'i18n-js';
import { createValidator } from 'utils/validator';
import { paymentTypes, attributeLabels } from './constants';

const validation = (values, tradingAccount) => {
  const {
    login: currentLogin,
    amount,
    source,
    target,
    paymentType,
  } = values;

  let rules = {
    paymentType: 'required|string',
    amount: ['required', 'numeric', 'greater:0', 'max:999999'],
    externalReference: 'required|string',
    accountUUID: 'required|string',
  };

  if ([
    paymentTypes.WITHDRAW.name,
    paymentTypes.TRANSFER.name,
  ].includes(paymentType)
      && currentLogin
      && amount
      && Number(tradingAccount.find(({ login }) => login === currentLogin).balance) < amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY') };
  }

  if ([paymentTypes.CREDIT_OUT.name].includes(paymentType)
    && currentLogin
    && amount
    && Number(tradingAccount.find(({ login }) => login === currentLogin).credit) < amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY') };
  }

  if (paymentType === paymentTypes.DEPOSIT.name) {
    rules = { ...rules, paymentMethod: 'required|string' };
  }

  if (paymentType === paymentTypes.CREDIT_IN.name) {
    rules = { ...rules, expirationDate: 'required|string' };
  }

  if (paymentType === paymentTypes.TRANSFER.name) {
    rules = {
      ...rules,
      source: 'required|string',
      target: 'required|string',
    };

    if (source
        && amount
        && Number(tradingAccount.find(
          ({ accountUUID }) => accountUUID === source,
        ).balance) < amount
    ) {
      return { source: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY') };
    }

    if (source
        && target
        && source === target) {
      return {
        source: I18n.t('COMMON.SOMETHING_WRONG'),
        target: I18n.t('COMMON.SOMETHING_WRONG'),
      };
    }
  }

  return createValidator(rules, attributeLabels, false)(values);
};

export {
  validation,
};
