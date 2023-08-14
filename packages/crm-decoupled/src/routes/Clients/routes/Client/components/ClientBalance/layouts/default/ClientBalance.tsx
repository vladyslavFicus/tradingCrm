// @ts-nocheck Select component write by js
import React, { useCallback } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { groupBy, sumBy } from 'lodash';
import I18n from 'i18n-js';
import { Select } from 'components';
import { Profile } from '__generated__/types';
import { selectOptions } from 'routes/Clients/routes/Client/components/constants/clientBalance';
import useClientBalance from 'routes/Clients/routes/Client/components/hooks/useClientBalance';
import './ClientBalance.scss';

type Props = {
  profile: Profile,
};

const ClientBalance = (_props: Props) => {
  const {
    tradingAccounts,
    amount,
    credit,
    baseCurrency,
    selectedDate,
    allowBalance,
    isDropDownOpen,
    depositAmount,
    depositCount,
    withdrawAmount,
    withdrawCount,
    firstDepositDate,
    firstWithdrawDate,
    lastDepositDate,
    lastWithdrawDate,
    getFormattedDate,
    handleDateChange,
    toggleDropdown,
  } = useClientBalance(_props);

  // ===== Renders ===== //
  const renderBalance = useCallback(() => (
    <>
      <div className="ClientBalance__text-primary">
        {baseCurrency} {I18n.toCurrency(amount, { unit: '' })}
      </div>

      <div className="ClientBalance__text-secondary">
        {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.CREDIT')}:
        {' '}
        {baseCurrency} {I18n.toCurrency(credit, { unit: '' })}
      </div>
    </>
  ), [amount, baseCurrency, credit]);

  const renderBalancesByCurrency = useCallback(() => {
    const accountsByCurrency = groupBy(tradingAccounts, 'currency');

    const balancesByCurrency = Object.keys(accountsByCurrency).map(currency => ({
      currency,
      amount: sumBy(accountsByCurrency[currency], 'balance'),
      credit: sumBy(accountsByCurrency[currency], 'credit'),
    }));

    return (
      <div className="ClientBalance__balances">
        {balancesByCurrency.map(balances => (
          <div className="ClientBalance__balance" key={balances.currency}>
            <div className="ClientBalance__text-title">
              {balances.currency} {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.BALANCE')}
            </div>

            <div className="ClientBalance__text-primary">
              {balances.currency} {I18n.toCurrency(balances.amount, { unit: '' })}
            </div>

            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.CREDIT')}:
              {' '}
              {balances.currency} {I18n.toCurrency(balances.credit, { unit: '' })}
            </div>
          </div>
        ))}
      </div>
    );
  }, [tradingAccounts]);

  const renderPaymentsStatistic = useCallback(() => (
    <>
      <Select
        customClassName="ClientBalance__select"
        data-testid="ClientBalance-paymentsSelect"
        onChange={handleDateChange}
        value={selectedDate}
      >
        {selectOptions().map(({ value, label }) => (
          <option key={value} value={value}>
            {I18n.t(label)}
          </option>
        ))}
      </Select>

      <div className="ClientBalance__statistics">
        {/* Deposit counter */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSIT')}
          </div>

          <div className="ClientBalance__text-primary">{depositCount}</div>

          <If condition={!!firstDepositDate}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {getFormattedDate(firstDepositDate)}
            </div>
          </If>

          <If condition={!!lastDepositDate}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {getFormattedDate(lastDepositDate)}
            </div>
          </If>
        </div>

        {/* Withdraw counter */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}
          </div>

          <div className="ClientBalance__text-primary">{withdrawCount}</div>

          <If condition={!!firstWithdrawDate}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {getFormattedDate(firstWithdrawDate)}
            </div>
          </If>

          <If condition={!!lastWithdrawDate}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {getFormattedDate(lastWithdrawDate)}
            </div>
          </If>
        </div>

        {/* Deposited sum */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSITED')}
          </div>

          <div className="ClientBalance__text-primary">
            {baseCurrency}: {I18n.toCurrency(depositAmount || 0, { unit: '' })}
          </div>
        </div>

        {/* Withdrawn sum */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWN')}
          </div>

          <div className="ClientBalance__text-primary">
            {baseCurrency}: {I18n.toCurrency(withdrawAmount || 0, { unit: '' })}
          </div>
        </div>

        {/* Net deposit */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.NET')}
          </div>

          <div className="ClientBalance__text-primary">
            {baseCurrency}: {I18n.toCurrency((Number(depositAmount) - Number(withdrawAmount)) || 0, { unit: '' })}
          </div>
        </div>
      </div>
    </>
  ), [
    baseCurrency, depositAmount, depositCount, firstDepositDate, firstWithdrawDate,
    getFormattedDate, handleDateChange, lastDepositDate, lastWithdrawDate,
    selectedDate, withdrawAmount, withdrawCount,
  ]);

  return (
    <If condition={allowBalance}>
      <div
        className={
          classNames('ClientBalance', {
            'ClientBalance--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="ClientBalance__text-title">
          {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.TOTAL_BALANCE')}
        </div>

        <Dropdown isOpen={isDropDownOpen} toggle={toggleDropdown}>
          <DropdownToggle tag="div">
            {renderBalance()}

            <i className="ClientBalance__arrow fa fa-angle-down" />
          </DropdownToggle>

          <DropdownMenu className="ClientBalance__dropdown-content">
            {renderBalancesByCurrency()}

            {renderPaymentsStatistic()}
          </DropdownMenu>
        </Dropdown>
      </div>
    </If>
  );
};

export default React.memo(ClientBalance);
