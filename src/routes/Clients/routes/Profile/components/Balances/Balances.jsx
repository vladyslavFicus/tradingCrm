import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { get, groupBy, sumBy } from 'lodash';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import { SelectField } from 'components/ReduxForm';
import ShortLoader from 'components/ShortLoader';
import { selectItems, moneyObj } from './constants';
import './Balances.scss';

class Balances extends Component {
  static propTypes = {
    depositPaymentStatistic: PropTypes.shape({
      statistics: PropTypes.shape({
        payments: PropTypes.shape({
          data: PropTypes.shape({
            itemsTotal: PropTypes.shape({
              totalAmount: PropTypes.number,
              totalCount: PropTypes.number,
            }),
          }),
        }),
      }),
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    withdrawPaymentStatistic: PropTypes.shape({
      statistics: PropTypes.shape({
        payments: PropTypes.shape({
          data: PropTypes.shape({
            itemsTotal: PropTypes.shape({
              totalAmount: PropTypes.number,
              totalCount: PropTypes.number,
            }),
          }),
        }),
      }),
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    balances: PropTypes.shape({
      baseCurrencyBalance: PropTypes.string,
      baseCurrencyCredit: PropTypes.string,
      baseCurrencyEquity: PropTypes.string,
      baseCurrencyMargin: PropTypes.string,
      currency: PropTypes.string,
      marginLevel: PropTypes.number,
    }),
    mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
    lastDeposit: PropTypes.string,
    lastWithdraw: PropTypes.string,
    selectValue: PropTypes.string,
  };

  static defaultProps = {
    balances: {},
    mt4Users: [],
    selectValue: null,
    lastDeposit: null,
    lastWithdraw: null,
  };

  static contextTypes = {
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  componentDidMount() {
    const {
      context: { registerUpdateCacheListener },
      constructor: { name },
      props: {
        depositPaymentStatistic: { refetch: depositStat },
        withdrawPaymentStatistic: { refetch: withdrawStat },
      },
    } = this;

    registerUpdateCacheListener(name, () => { depositStat(); withdrawStat(); });
  }

  componentWillReceiveProps(nextProps) {
    // INFO: when select value changed - make refetch
    if (this.props.selectValue && nextProps.selectValue !== this.props.selectValue) {
      this.props.depositPaymentStatistic.refetch({ dateFrom: nextProps.selectValue });
      this.props.withdrawPaymentStatistic.refetch({ dateFrom: nextProps.selectValue });
    }
  }

  componentWillUnmount() {
    const { unRegisterUpdateCacheListener } = this.context;
    const { name: componentName } = this.constructor;

    unRegisterUpdateCacheListener(componentName);
  }

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  renderDropDown = (
    dropDownOpen,
    { baseCurrencyBalance, baseCurrencyCredit, baseCurrencyEquity, baseCurrencyMargin }
  ) => {
    const baseCurrency = getActiveBrandConfig().currencies.base;

    const {
      lastDeposit,
      lastWithdraw,
      depositPaymentStatistic: { statistics, loading },
      withdrawPaymentStatistic: { statistics: withdrawStat, loading: widthdrawLoading },
    } = this.props;

    const {
      totalAmount: depositAmount,
      totalCount: depositCount,
    } = get(statistics, 'payments.data.itemsTotal') || moneyObj;
    const {
      totalAmount: withdrawAmount,
      totalCount: withdrawCount,
    } = get(withdrawStat, 'payments.data.itemsTotal') || moneyObj;

    const depositError = get(statistics, 'payments.error');
    const withdrawError = get(statistics, 'payments.error');

    // ======= Calculate sum of trading accounts balances by currency  ======= //
    const accountsByCurrency = groupBy(this.props.mt4Users, 'symbol');

    // Sum account balances by each unique currency
    const balancesByCurrency = Object.keys(accountsByCurrency).map(currency => ({
      currency,
      balance: sumBy(accountsByCurrency[currency], 'balance'),
      credit: sumBy(accountsByCurrency[currency], 'credit'),
      equity: sumBy(accountsByCurrency[currency], 'equity'),
      margin: sumBy(accountsByCurrency[currency], 'margin'),
    }), {});

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <DropdownToggle
          tag="div"
          data-toggle="dropdown"
          aria-expanded={dropDownOpen}
        >
          <div className="dropdown-tab">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.TOTAL_BALANCE')}</div>
            <i className="fa fa-angle-down" />
            <div className="header-block-middle">
              {baseCurrency} {Number(baseCurrencyBalance).toFixed(2)}
            </div>
            <div className="header-block-small">
              {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}: {baseCurrency} {Number(baseCurrencyCredit).toFixed(2)}
            </div>
            <div className="header-block-small">
              {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.MARGIN')}: {baseCurrency} {Number(baseCurrencyMargin).toFixed(2)}
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <div className="dropdown-menu__content">
            <DropdownItem toggle={false}>
              <If condition={balancesByCurrency.length}>
                <div className="row margin-0 margin-bottom-15 balance-list">
                  {balancesByCurrency.map(balance => (
                    <div key={balance.currency} className="col-6 balance-item">
                      <div className="header-block-title">
                        {balance.currency} {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.BALANCE')}
                      </div>
                      <div className="header-block-middle">
                        {balance.currency} {Number(balance.balance).toFixed(2)}
                      </div>
                      <div className="header-block-small">
                        {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}:&nbsp;
                        {balance.currency} {Number(balance.credit).toFixed(2)}
                      </div>
                      <div className="header-block-small">
                        {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.MARGIN')}:&nbsp;
                        {balance.currency} {Number(balance.margin).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </If>
              <form className="balance-select-field">
                <Field
                  name="date"
                  component={SelectField}
                >
                  {selectItems.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
                </Field>
              </form>
            </DropdownItem>
            <Choose>
              <When condition={!loading || !widthdrawLoading || depositError || withdrawError}>
                <DropdownItem>
                  <div className="row">
                    <div className="col-6">
                      <div className="header-block-title">
                        {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSIT')}
                      </div>
                      <div className={`header-block-middle ${lastWithdraw ? '' : 'margin-bottom-15'}`}>
                        {depositCount}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="header-block-title">
                        {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}
                      </div>
                      <div className={`header-block-middle ${lastWithdraw ? '' : 'margin-bottom-15'}`}>
                        {withdrawCount}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <If condition={lastDeposit}>
                        <div className="header-block-small margin-bottom-15">
                          {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {moment(lastDeposit).format('DD.MM.YYYY')}
                        </div>
                      </If>
                    </div>
                    <div className="col-6">
                      <If condition={lastWithdraw}>
                        <div className="header-block-small margin-bottom-15">
                          {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {moment(lastWithdraw).format('DD.MM.YYYY')}
                        </div>
                      </If>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSITED')}</div>
                      <div className="header-block-middle">{baseCurrency}: {Number(depositAmount).toFixed(2)}</div>
                    </div>
                    <div className="col-6">
                      <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWN')}</div>
                      <div className="header-block-middle">{baseCurrency}: {Number(withdrawAmount).toFixed(2)}</div>
                    </div>
                  </div>
                </DropdownItem>
              </When>
              <Otherwise condition={loading}>
                <div className="balance-loader">
                  <ShortLoader height={20} />
                </div>
              </Otherwise>
            </Choose>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  };

  render() {
    const { dropDownOpen } = this.state;
    const { balances } = this.props;
    const dropdownClassName = classNames('dropdown-highlight cursor-pointer', 'balance-dropdown', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={dropdownClassName}>
        {this.renderDropDown(dropDownOpen, balances)}
      </div>
    );
  }
}

export default Balances;
