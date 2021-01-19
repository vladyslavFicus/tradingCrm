import React, { PureComponent } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Field } from 'formik';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import { FormikSelectField } from 'components/Formik';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Badge from 'components/Badge';
import { paymentTypes, attributeLabels } from '../../constants';
import './AccountsSelectField.scss';

class AccountsSelectField extends PureComponent {
  static propTypes = {
    tradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount).isRequired,
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.shape({
      amount: PropTypes.number,
      paymentType: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    className: '',
  };

  renderOption = () => ({ onClick, account = {}, forwardedRef }) => {
    const {
      name,
      values: {
        amount,
        paymentType,
      },
    } = this.props;

    const isInsufficientBalance = (
      parseFloat(account.balance) < amount
      && [paymentTypes.WITHDRAW.name, paymentTypes.TRANSFER.name].includes(paymentType)
      && name !== 'target'
    );

    const isInsufficientCredit = (
      parseFloat(account.credit) < amount
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
            text={I18n.t(accountTypesLabels[account.accountType].label)}
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
          <div className={classNames({ 'color-danger': Number(account.balance) === 0 })}>
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.BALANCE')}: {account.currency} {account.balance}
          </div>
          <div>{I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.GROUP')}: {account.group}</div>
          <If condition={[paymentTypes.CREDIT_IN.name, paymentTypes.CREDIT_OUT.name].includes(paymentType)}>
            <div className={classNames({ 'color-danger': Number(account.credit) === 0 })}>
              {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.CREDIT')}: {account.currency} {account.credit}
            </div>
          </If>
        </div>
        <If condition={isInsufficientBalance || isInsufficientCredit}>
          <div className="color-danger">
            {I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.NO_MONEY')}
          </div>
        </If>
      </div>
    );
  };

  render() {
    const {
      tradingAccounts,
      className,
      name,
      label,
      values: {
        paymentType,
      },
    } = this.props;

    return (
      <Field
        className={classNames('AccountsSelectField', className)}
        name={name}
        label={attributeLabels[label]}
        placeholder={tradingAccounts.length === 0
          ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
          : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
        }
        singleOptionComponent={this.renderOption()}
        disabled={tradingAccounts.length === 0}
        component={FormikSelectField}
        showErrorMessage={false}
      >
        {tradingAccounts
          .filter(account => (
            !account.archived && !(
              account.accountType === 'DEMO'
                && [
                  paymentTypes.CREDIT_IN.name,
                  paymentTypes.CREDIT_OUT.name,
                  paymentTypes.TRANSFER.name,
                  paymentTypes.WITHDRAW.name,
                ].includes(paymentType)
            )
          ))
          .map(account => (
            <option key={account.accountUUID} value={account.accountUUID} account={account}>
              {`${account.login}`}
            </option>
          ))}
      </Field>
    );
  }
}

export default AccountsSelectField;
