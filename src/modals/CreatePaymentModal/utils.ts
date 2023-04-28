import I18n from 'i18n-js';
import { createValidator } from 'utils/validator';
import { PaymentMutationCreatePaymentArgs as PaymentValues, TradingAccount } from '__generated__/types';
import { paymentTypes, attributeLabels } from './constants';

type Rules = Record<string, string | Array<string>>;

const validation = (values: PaymentValues, tradingAccounts: Array<TradingAccount>) => {
  const {
    login: currentLogin,
    amount,
    source,
    target,
    paymentType,
  } = values;

  let rules: Rules = {
    paymentType: 'required|string',
    amount: ['required', 'numeric', 'greater:0', 'max:999999'],
    accountUUID: 'required|string',
  };

  if ([
    paymentTypes.WITHDRAW.name,
    paymentTypes.TRANSFER.name,
    paymentTypes.COMMISSION.name,
  ].includes(paymentType)
      && currentLogin
      && amount
      && Number(tradingAccounts.find(({ login }) => login === currentLogin)?.balance) < amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY') };
  }

  if ([paymentTypes.CREDIT_OUT.name].includes(paymentType)
    && currentLogin
    && amount
    && Number(tradingAccounts.find(({ login }) => login === currentLogin)?.credit) < amount
  ) {
    return { login: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY') };
  }

  if (paymentType === paymentTypes.DEPOSIT.name) {
    rules = {
      ...rules,
      paymentMethod: 'required|string',
      externalReference: 'required|string',
    };
  }

  if (paymentType === paymentTypes.CREDIT_IN.name) {
    rules = {
      ...rules,
      paymentMethod: 'required|string',
      expirationDate: 'required|string',
    };
  }

  if (paymentType === paymentTypes.TRANSFER.name) {
    rules = {
      paymentType: rules.paymentType,
      amount: rules.amount,
      source: 'required|string',
      target: 'required|string',
    };

    if (source
        && amount
        && Number(tradingAccounts.find(
          ({ accountUUID }) => accountUUID === source,
        )?.balance) < amount
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
