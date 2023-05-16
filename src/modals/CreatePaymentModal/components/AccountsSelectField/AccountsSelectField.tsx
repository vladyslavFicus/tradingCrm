import React, { RefObject, useMemo } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { TradingAccount } from '__generated__/types';
import { accountTypesLabels } from 'constants/accountTypes';
import { FormikSelectField } from 'components/Formik';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Badge from 'components/Badge';
import { paymentTypes, attributeLabels } from '../../constants';
import './AccountsSelectField.scss';

type Values = {
  amount: number,
  paymentType: string,
};

type Props = {
  tradingAccounts: Array<TradingAccount>,
  name: string,
  label: string,
  values: Values,
  className?: string,
};

type SingleOption = {
  onClick: () => void,
  'data-account': TradingAccount,
  forwardedRef: RefObject<HTMLDivElement>,
};

const AccountsSelectField = (props: Props) => {
  const {
    name,
    tradingAccounts,
    label,
    className = '',
    values: {
      amount,
      paymentType,
    },
  } = props;

  const renderOption = () => (singleOption: SingleOption) => {
    const { onClick, forwardedRef } = singleOption;
    const account = singleOption['data-account'] as TradingAccount;

    const isInsufficientBalance = (
      account.balance < amount
      && [paymentTypes.WITHDRAW.name, paymentTypes.TRANSFER.name].includes(paymentType)
      && name !== 'target'
    );

    const isInsufficientCredit = (
      account.credit < amount
      && [paymentTypes.CREDIT_OUT.name].includes(paymentType)
    );

    return (
      <div
        ref={forwardedRef}
        className="AccountsSelectField__option"
        onClick={isInsufficientBalance || isInsufficientCredit ? () => {} : onClick}
      >
        <div className="AccountsSelectField__option-title">
          <Badge
            center
            text={I18n.t(accountTypesLabels[account.accountType]?.label) || ''}
            info={account.accountType === 'DEMO'}
            success={account.accountType === 'LIVE'}
          >
            {account.name}
          </Badge>
        </div>

        <div className="AccountsSelectField__option-content">
          <PlatformTypeBadge platformType={account.platformType} center>
            {account.login}
          </PlatformTypeBadge>

          <div className={classNames({ AccountsSelectField__error: !Number(account.balance) })}>
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.BALANCE')}: {account.currency}
            {I18n.toCurrency(account.balance, { unit: '', precision: 5 })}
          </div>

          <div>{I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.GROUP')}: {account.group}</div>

          <If condition={[paymentTypes.CREDIT_IN.name, paymentTypes.CREDIT_OUT.name].includes(paymentType)}>
            <div className={classNames({ AccountsSelectField__error: !Number(account.credit) })}>
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.CREDIT')}: {account.currency}
              {I18n.toCurrency(account.credit, { unit: '' })}
            </div>
          </If>
        </div>

        <If condition={isInsufficientBalance || isInsufficientCredit}>
          <div className="AccountsSelectField__error">
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY')}
          </div>
        </If>
      </div>
    );
  };

  const filterTradingAccounts = useMemo(() => tradingAccounts
    .filter(account => (
      !account.archived && !(
        account.accountType === 'DEMO'
          && [
            paymentTypes.CREDIT_IN.name,
            paymentTypes.CREDIT_OUT.name,
            paymentTypes.TRANSFER.name,
            paymentTypes.WITHDRAW.name,
            paymentTypes.COMMISSION.name,
          ].includes(paymentType)
      )
    )), [tradingAccounts]);

  return (
    <Field
      className={classNames('AccountsSelectField', className)}
      name={name}
      label={attributeLabels[label]}
      placeholder={!tradingAccounts.length
        ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
        : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
        }
      singleOptionComponent={renderOption()}
      disabled={!tradingAccounts.length}
      component={FormikSelectField}
      showErrorMessage={false}
    >
      {filterTradingAccounts.map(account => (
        <option
          key={account.accountUUID}
          value={account.accountUUID as string}
          data-account={account}
        >
          {`${account.login}`}
        </option>
      ))}
    </Field>
  );
};

export default React.memo(AccountsSelectField);
