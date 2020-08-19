import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { get, groupBy, sumBy } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import { withRequests } from 'apollo';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import { selectItems, moneyObj } from './constants';
import { PaymentStatisticWithdrawQuery, PaymentStatisticDepositQuery } from './graphql';
import './Balances.scss';

class Balances extends PureComponent {
  static propTypes = {
    clientRegistrationDate: PropTypes.string.isRequired,
    depositPaymentStatistic: PropTypes.paymentsStatistic.isRequired,
    withdrawPaymentStatistic: PropTypes.paymentsStatistic.isRequired,
    balances: PropTypes.shape({
      amount: PropTypes.string,
      credit: PropTypes.string,
      currency: PropTypes.string,
    }),
    tradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
  };

  static defaultProps = {
    balances: {},
    tradingAccounts: [],
  };

  state = {
    dropDownOpen: false,
    dateFrom: selectItems[0].value,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.depositPaymentStatistic.refetch();
    this.props.withdrawPaymentStatistic.refetch();
  };

  toggle = () => {
    this.setState(({ dropDownOpen }) => ({
      dropDownOpen: !dropDownOpen,
    }));
  };

  handleDateChange = async (dateFrom) => {
    const { depositPaymentStatistic, withdrawPaymentStatistic, clientRegistrationDate } = this.props;

    this.setState({ dateFrom });

    const refetchData = {
      dateFrom: moment()
        .utc(dateFrom || clientRegistrationDate)
        .format(),
      dateTo: moment()
        .add(2, 'day')
        .startOf('day')
        .utc()
        .format(),
    };

    await depositPaymentStatistic.refetch(refetchData);
    await withdrawPaymentStatistic.refetch(refetchData);
  };

  renderTradingAccounts = () => {
    const accountsByCurrency = groupBy(this.props.tradingAccounts, 'currency');

    const balancesByCurrency = Object.keys(accountsByCurrency).map(currency => ({
      currency,
      balance: sumBy(accountsByCurrency[currency], 'balance'),
      credit: sumBy(accountsByCurrency[currency], 'credit'),
    }));

    if (balancesByCurrency.length) {
      return (
        <div className="row margin-0 margin-bottom-15 balance-list">
          {balancesByCurrency.map(({ balance, credit, currency }) => (
            <div key={currency} className="col-6 balance-item">
              <div className="header-block-title">
                {currency} {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.BALANCE')}
              </div>
              <div className="header-block-middle">
                {currency} {Number(balance).toFixed(2)}
              </div>
              <div className="header-block-small">
                {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}:&nbsp;
                {currency} {Number(credit).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  renderTotalBalance = () => {
    const {
      balances: { amount, credit },
    } = this.props;
    const baseCurrency = getActiveBrandConfig().currencies.base;

    return (
      <div className="dropdown-tab">
        <div className="header-block-title">
          {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.TOTAL_BALANCE')}
        </div>
        <i className="fa fa-angle-down" />
        <div className="header-block-middle">
          {baseCurrency} {Number(amount).toFixed(2)}
        </div>
        <div className="header-block-small">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}: {baseCurrency}{' '}
          {Number(credit).toFixed(2)}
        </div>
      </div>
    );
  };

  renderStatistics = () => {
    const baseCurrency = getActiveBrandConfig().currencies.base;

    const {
      depositPaymentStatistic: {
        data: depositStat,
        loading: depositLoading,
      },
      withdrawPaymentStatistic: {
        data: withdrawStat,
        loading: widthdrawLoading,
      },
    } = this.props;
    const {
      totalAmount: depositAmount,
      totalCount: depositCount,
    } = get(depositStat, 'paymentsStatistic.itemsTotal') || moneyObj;
    const {
      totalAmount: withdrawAmount,
      totalCount: withdrawCount,
    } = get(withdrawStat, 'paymentsStatistic.itemsTotal') || moneyObj;

    const depositItems = get(depositStat, 'paymentsStatistic.items', [])
      .filter(i => i.amount > 0);
    const withdrawItems = get(withdrawStat, 'paymentsStatistic.items', [])
      .filter(i => i.amount > 0);

    const lastDepositItem = depositItems[depositItems.length - 1];
    const lastWithdrawItem = withdrawItems[withdrawItems.length - 1];

    const firstDepositItem = depositItems[0];
    const firstWithdrawItem = withdrawItems[0];

    return (
      <Choose>
        <When condition={!depositLoading || !widthdrawLoading}>
          <div className="row">
            <div className="col-6">
              <div className="header-block-title">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSIT')}
              </div>
              <div
                className={classNames('header-block-middle', {
                  'margin-bottom-15': !lastWithdrawItem,
                })}
              >
                {depositCount}
              </div>
            </div>
            <div className="col-6">
              <div className="header-block-title">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}
              </div>
              <div
                className={classNames('header-block-middle', {
                  'margin-bottom-15': !lastWithdrawItem,
                })}
              >
                {withdrawCount}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <If condition={firstDepositItem}>
                <div className="header-block-small margin-bottom-15">
                  {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')}{' '}
                  {moment(firstDepositItem.entryDate).format('DD.MM.YYYY')}
                </div>
              </If>
              <If condition={lastDepositItem}>
                <div className="header-block-small margin-bottom-15">
                  {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}{' '}
                  {moment(lastDepositItem.entryDate).format('DD.MM.YYYY')}
                </div>
              </If>
            </div>
            <div className="col-6">
              <If condition={firstWithdrawItem}>
                <div className="header-block-small margin-bottom-15">
                  {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.FIRST')}{' '}
                  {moment(firstWithdrawItem.entryDate).format('DD.MM.YYYY')}
                </div>
              </If>
              <If condition={lastWithdrawItem}>
                <div className="header-block-small margin-bottom-15">
                  {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}{' '}
                  {moment(lastWithdrawItem.entryDate).format('DD.MM.YYYY')}
                </div>
              </If>
            </div>
          </div>
          <div className="row margin-bottom-15">
            <div className="col-6">
              <div className="header-block-title">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSITED')}
              </div>
              <div className="header-block-middle">
                {baseCurrency}: {Number(depositAmount).toFixed(2)}
              </div>
            </div>
            <div className="col-6">
              <div className="header-block-title">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWN')}
              </div>
              <div className="header-block-middle">
                {baseCurrency}: {Number(withdrawAmount).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="header-block-title">
                {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.NET')}
              </div>
              <div className="header-block-middle">
                {baseCurrency}:{' '}
                {(Number(depositAmount) - Number(withdrawAmount)).toFixed(2)}
              </div>
            </div>
          </div>
        </When>
        <Otherwise condition={depositLoading}>
          <div className="balance-loader">
            <ShortLoader height={20} />
          </div>
        </Otherwise>
      </Choose>
    );
  };

  render() {
    const { dropDownOpen, dateFrom } = this.state;

    const dropdownClassName = classNames(
      'dropdown-highlight cursor-pointer',
      'balance-dropdown',
      {
        'dropdown-open': dropDownOpen,
      },
    );

    return (
      <div className={dropdownClassName}>
        <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="div"
            data-toggle="dropdown"
            aria-expanded={dropDownOpen}
          >
            {this.renderTotalBalance()}
          </DropdownToggle>
          <DropdownMenu>
            <div className="dropdown-menu__content">
              {this.renderTradingAccounts()}
              <If condition={dropDownOpen}>
                <div className="row margin-0 margin-bottom-15">
                  <form className="balance-select-field">
                    <Select
                      onChange={this.handleDateChange}
                      value={dateFrom}
                    >
                      {selectItems.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {I18n.t(label)}
                        </option>
                      ))}
                    </Select>
                  </form>
                </div>
              </If>
              {this.renderStatistics()}
            </div>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default withRequests({
  withdrawPaymentStatistic: PaymentStatisticWithdrawQuery,
  depositPaymentStatistic: PaymentStatisticDepositQuery,
})(Balances);
