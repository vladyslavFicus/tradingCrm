import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { groupBy, sumBy } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { Profile, StatisticDetalization__Enum as StatisticDetalization } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import Select from 'components/Select';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { selectOptions } from './constants';
import { usePaymentStatisticDepositQuery } from './graphql/__generated__/PaymentStatisticDepositQuery';
import { usePaymentStatisticWithdrawQuery } from './graphql/__generated__/PaymentStatisticWithdrawQuery';
import './ClientBalance.scss';

type Props = {
  profile: Profile,
};

const ClientBalance = (props: Props) => {
  const { profile } = props;

  const {
    uuid: profileId,
    profileView,
    registrationDetails: {
      registrationDate,
    },
    tradingAccounts,
  } = profile;

  const amount = profileView?.balance?.amount || 0;
  const credit = profileView?.balance?.credit || 0;

  const baseCurrency = getBrand().currencies.base;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowBalance = permission.allows(permissions.USER_PROFILE.BALANCE);

  // ===== Requests ===== //
  const paymentStatisticDepositQuery = usePaymentStatisticDepositQuery({
    variables: {
      profileId,
      detalization: StatisticDetalization.PER_DAYS,
      additionalStatistics: [],
      paymentType: 'DEPOSIT',
      dateFrom: moment(registrationDate || '').utc().format(),
      dateTo: moment().utc().add(2, 'day').startOf('day')
        .format(),
    },
  });

  const paymentStatisticWithdrawQuery = usePaymentStatisticWithdrawQuery({
    variables: {
      profileId,
      paymentType: 'WITHDRAW',
      detalization: StatisticDetalization.PER_DAYS,
      additionalStatistics: [],
      dateFrom: moment(registrationDate || '').utc().format(),
      dateTo: moment().utc().add(2, 'day').startOf('day')
        .format(),
    },
  });

  const {
    totalAmount: depositAmount,
    totalCount: depositCount,
  } = paymentStatisticDepositQuery.data?.paymentsStatistic?.itemsTotal || {};

  const {
    totalAmount: withdrawAmount,
    totalCount: withdrawCount,
  } = paymentStatisticWithdrawQuery.data?.paymentsStatistic?.itemsTotal || {};

  const deposits = paymentStatisticDepositQuery.data?.paymentsStatistic?.items || [];
  const withdraws = paymentStatisticWithdrawQuery.data?.paymentsStatistic?.items || [];

  const depositsWithAmounts = deposits.filter(deposit => deposit.amount > 0);
  const withdrawsWithAmounts = withdraws.filter(withdraw => withdraw.amount > 0);

  const firstDeposit = depositsWithAmounts[0];
  const firstWithdraw = withdrawsWithAmounts[0];

  const lastDeposit = depositsWithAmounts[depositsWithAmounts.length - 1];
  const lastWithdraw = withdrawsWithAmounts[withdrawsWithAmounts.length - 1];

  const toggleDropdown = () => setIsDropDownOpen(!isDropDownOpen);

  const getFormatedDate = (value: string) => moment(value).format('DD.MM.YYYY');

  //  // ===== Handlers ===== //
  const handleDateChange = async (value: string) => {
    setSelectedDate(value);

    const refetchData = {
      // If we have 'All the time' selected, just provide registration date for request
      dateFrom: moment.utc(value || registrationDate || '').format(),
      dateTo: moment().add(2, 'day').startOf('day').utc()
        .format(),
    };

    await paymentStatisticDepositQuery.refetch(refetchData);
    await paymentStatisticWithdrawQuery.refetch(refetchData);
  };

  // ===== Renders ===== //
  const renderBalance = () => (
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
  );

  const renderBalancesByCurrency = () => {
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
  };

  const renderPaymentsStatistic = () => (
    <>
      <Select
        // @ts-ignore Select component write by js
        customClassName="ClientBalance__select"
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

          <If condition={!!firstDeposit}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {getFormatedDate(firstDeposit.entryDate)}
            </div>
          </If>

          <If condition={!!lastDeposit}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {getFormatedDate(lastDeposit.entryDate)}
            </div>
          </If>
        </div>

        {/* Withdraw counter */}
        <div className="ClientBalance__statistic">
          <div className="ClientBalance__text-title">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}
          </div>

          <div className="ClientBalance__text-primary">{withdrawCount}</div>

          <If condition={!!firstWithdraw}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {getFormatedDate(firstWithdraw.entryDate)}
            </div>
          </If>

          <If condition={!!lastWithdraw}>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {getFormatedDate(lastWithdraw.entryDate)}
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
  );

  const onClientReload = () => {
    paymentStatisticDepositQuery.refetch();
    paymentStatisticWithdrawQuery.refetch();
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, onClientReload);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, onClientReload);
    };
  }, []);

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
