import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { groupBy, sumBy } from 'lodash';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import PaymentStatisticDepositQuery from './graphql/PaymentStatisticDepositQuery';
import PaymentStatisticWithdrawQuery from './graphql/PaymentStatisticWithdrawQuery';
import { selectOptions } from './constants';
import './ClientBalance.scss';

class ClientBalance extends PureComponent {
  static propTypes = {
    paymentStatisticDepositQuery: PropTypes.paymentsStatistic.isRequired,
    paymentStatisticWithdrawQuery: PropTypes.paymentsStatistic.isRequired,
    registrationDate: PropTypes.string.isRequired,
    tradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount).isRequired,
    balance: PropTypes.shape({
      amount: PropTypes.string,
      credit: PropTypes.string,
    }).isRequired,
  }

  state = {
    isDropDownOpen: false,
    selectedDate: null,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.onClientReload);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.onClientReload);
  }

  onClientReload = () => {
    this.props.paymentStatisticDepositQuery.refetch();
    this.props.paymentStatisticWithdrawQuery.refetch();
  };

  toggleDropdown = () => {
    this.setState(({ isDropDownOpen }) => ({ isDropDownOpen: !isDropDownOpen }));
  };

  getFormatedDate = value => moment(value).format('DD.MM.YYYY');

  handleDateChange = async (selectedDate) => {
    const {
      registrationDate,
      paymentStatisticDepositQuery,
      paymentStatisticWithdrawQuery,
    } = this.props;

    this.setState({ selectedDate });

    const refetchData = {
      // If we have 'All the time' selected, just provide registration date for request
      dateFrom: moment.utc(selectedDate || registrationDate)
        .format(),
      dateTo: moment().add(2, 'day').startOf('day').utc()
        .format(),
    };

    await paymentStatisticDepositQuery.refetch(refetchData);
    await paymentStatisticWithdrawQuery.refetch(refetchData);
  };

  renderBalance = () => {
    const { balance } = this.props;
    const { amount, credit } = balance || {};
    const baseCurrency = getBrand().currencies.base;

    return (
      <>
        <div className="ClientBalance__text-primary">
          {baseCurrency} {I18n.toCurrency(amount, { unit: '' })}
        </div>

        <div className="ClientBalance__text-secondary">
          {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.CREDIT')}:{' '}
          {baseCurrency} {I18n.toCurrency(credit, { unit: '' })}
        </div>
      </>
    );
  }

  renderBalancesByCurrency = () => {
    const { tradingAccounts } = this.props;

    const accountsByCurrency = groupBy(tradingAccounts, 'currency');

    const balancesByCurrency = Object.keys(accountsByCurrency).map(currency => ({
      currency,
      amount: sumBy(accountsByCurrency[currency], 'balance'),
      credit: sumBy(accountsByCurrency[currency], 'credit'),
    }));

    return (
      <div className="ClientBalance__balances">
        {balancesByCurrency.map(({ amount, credit, currency }) => (
          <div className="ClientBalance__balance" key={currency}>
            <div className="ClientBalance__text-title">
              {currency} {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.BALANCE')}
            </div>
            <div className="ClientBalance__text-primary">
              {currency} {I18n.toCurrency(amount, { unit: '' })}
            </div>
            <div className="ClientBalance__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.CREDIT')}:{' '}
              {currency} {I18n.toCurrency(credit, { unit: '' })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderPaymentsStatistic = () => {
    const { paymentStatisticDepositQuery, paymentStatisticWithdrawQuery } = this.props;
    const { selectedDate } = this.state;

    const baseCurrency = getBrand().currencies.base;

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

    const depositsWithAmounts = deposits.filter(({ amount }) => amount > 0);
    const withdrawsWithAmounts = withdraws.filter(({ amount }) => amount > 0);

    const firstDeposit = depositsWithAmounts[0];
    const firstWithdraw = withdrawsWithAmounts[0];

    const lastDeposit = depositsWithAmounts[depositsWithAmounts.length - 1];
    const lastWithdraw = withdrawsWithAmounts[withdrawsWithAmounts.length - 1];

    return (
      <>
        <Select
          customClassName="ClientBalance__select"
          onChange={this.handleDateChange}
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

            <If condition={firstDeposit}>
              <div className="ClientBalance__text-secondary">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {this.getFormatedDate(firstDeposit.entryDate)}
              </div>
            </If>

            <If condition={lastDeposit}>
              <div className="ClientBalance__text-secondary">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {this.getFormatedDate(lastDeposit.entryDate)}
              </div>
            </If>
          </div>

          {/* Withdraw counter */}
          <div className="ClientBalance__statistic">
            <div className="ClientBalance__text-title">
              {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}
            </div>

            <div className="ClientBalance__text-primary">{withdrawCount}</div>

            <If condition={firstWithdraw}>
              <div className="ClientBalance__text-secondary">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')} {this.getFormatedDate(firstWithdraw.entryDate)}
              </div>
            </If>

            <If condition={lastWithdraw}>
              <div className="ClientBalance__text-secondary">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {this.getFormatedDate(lastWithdraw.entryDate)}
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
              {baseCurrency}: {I18n.toCurrency((depositAmount - withdrawAmount) || 0, { unit: '' })}
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    const { isDropDownOpen } = this.state;

    return (
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

        <Dropdown isOpen={isDropDownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle tag="div">
            {this.renderBalance()}
            <i className="ClientBalance__arrow fa fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu className="ClientBalance__dropdown-content">
            {this.renderBalancesByCurrency()}
            {this.renderPaymentsStatistic()}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default withRequests({
  paymentStatisticDepositQuery: PaymentStatisticDepositQuery,
  paymentStatisticWithdrawQuery: PaymentStatisticWithdrawQuery,
})(ClientBalance);
