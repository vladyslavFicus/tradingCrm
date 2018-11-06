import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import { SelectField } from '../../../../../../components/ReduxForm';
import ShortLoader from '../../../../../../components/ShortLoader';
import { selectItems, moneyObj } from './constants';
import './Balances.scss';

class Balances extends Component {
  static propTypes = {
    paymentStatistic: PropTypes.shape({
      clientPaymentsStatistic: PropTypes.shape({
        depositCount: PropTypes.number.isRequired,
        depositAmount: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currency: PropTypes.string.isRequired,
        }).isRequired,
        withdrawCount: PropTypes.number.isRequired,
        withdrawAmount: PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currency: PropTypes.string.isRequired,
        }).isRequired,
      }),
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
    }),
    balances: PropTypes.shape({
      balance: PropTypes.string,
      equity: PropTypes.string,
      currency: PropTypes.string,
    }),
    lastDeposit: PropTypes.string,
    lastWithdraw: PropTypes.string,
    selectValue: PropTypes.string,
  };

  static defaultProps = {
    paymentStatistic: {},
    balances: {},
    selectValue: null,
    lastDeposit: null,
    lastWithdraw: null,
  }

  state = {
    dropDownOpen: false,
  };

  componentWillReceiveProps(nextProps) {
    // INFO: when select value changed - make refetch
    if (this.props.selectValue && nextProps.selectValue !== this.props.selectValue) {
      this.props.paymentStatistic.refetch({ startDate: nextProps.selectValue });
    }
  }

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  renderDropDown = (
    dropDownOpen,
    statistic,
    { currency, balance, equity }
  ) => {
    const { lastDeposit, lastWithdraw, paymentStatistic: { loading } } = this.props;
    const { depositCount, withdrawCount } = statistic;
    const { amount: depAmount, currency: depCurrency } = get(statistic, 'depositAmount') || moneyObj;
    const { amount: withdrawAmount, currency: withdrawCurrency } = get(statistic, 'withdrawAmount') || moneyObj;

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <DropdownToggle
          tag="div"
          data-toggle="dropdown"
          aria-expanded={dropDownOpen}
        >
          <div className="dropdown-tab">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.BALANCE')}</div>
            <i className="fa fa-angle-down" />
            <div className="header-block-middle">
              {currency} {Number(balance).toFixed(2)}
            </div>
            <div className="header-block-small">
              {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.EQUITY')}: {currency} {Number(equity).toFixed(2)}
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <div className="dropdown-menu__content">
            <DropdownItem toggle={false}>
              <form className="balance-select-field">
                <Field
                  name="date"
                  component={SelectField}
                >
                  {selectItems.map(item => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </Field>
              </form>
            </DropdownItem>
            <Choose>
              <When condition={!loading}>
                <DropdownItem>
                  <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSIT')}</div>
                  <div className={`header-block-middle ${lastWithdraw ? '' : 'margin-bottom-15'}`}>{depositCount}</div>
                  <If condition={lastDeposit}>
                    <div className="header-block-small margin-bottom-15">
                      {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {moment(lastDeposit).format('DD.MM.YYYY')}
                    </div>
                  </If>
                  <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSITED')}</div>
                  <div className="header-block-middle">{depCurrency}: {Number(depAmount).toFixed(2)}</div>
                </DropdownItem>
                <DropdownItem>
                  <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}</div>
                  <div className={`header-block-middle ${lastWithdraw ? '' : 'margin-bottom-15'}`}>{withdrawCount}</div>
                  <If condition={lastWithdraw}>
                    <div className="header-block-small margin-bottom-15">
                      {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')} {moment(lastWithdraw).format('DD.MM.YYYY')}
                    </div>
                  </If>
                  <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWN')}</div>
                  <div className="header-block-middle">{withdrawCurrency}: {Number(withdrawAmount).toFixed(2)}</div>
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
  }

  render() {
    const { dropDownOpen } = this.state;
    const { paymentStatistic, balances } = this.props;
    const dropdownClassName = classNames('dropdown-highlight cursor-pointer', 'balance-dropdown', {
      'dropdown-open': dropDownOpen,
    });

    const statistic = get(paymentStatistic, 'clientPaymentsStatistic') || {};

    return (
      <div className={dropdownClassName}>
        {this.renderDropDown(dropDownOpen, statistic, balances)}
      </div>
    );
  }
}

export default Balances;
