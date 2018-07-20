import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import { SelectField } from '../../../../../../components/ReduxForm';
import { selectItems } from './constants';
import './Balances.scss';

class Balances extends Component {
  static propTypes = {
    paymentStatistic: PropTypes.shape({
      clientPaymentsStatistic: PropTypes.shape({
        depositCount: PropTypes.number.isRequired,
        depositAmount: PropTypes.number.isRequired,
        withdrawCount: PropTypes.number.isRequired,
        withdrawAmount: PropTypes.number.isRequired,
      }),
      refetch: PropTypes.func.isRequired,
    }),
    balances: PropTypes.shape({
      balance: PropTypes.string,
      equity: PropTypes.string,
      currency: PropTypes.string,
    }),
    selectValue: PropTypes.string,
  };

  static defaultProps = {
    paymentStatistic: {},
    balances: {},
    selectValue: null,
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
    console.log('toggled');
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  renderDropDown = (
    dropDownOpen,
    { depositCount, depositAmount, withdrawCount, withdrawAmount },
    { currency, balance, equity }
  ) => (
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
          <DropdownItem>
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSIT')}</div>
            <div className="header-block-middle">{depositCount}</div>
            <div className="header-block-small margin-bottom-15">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}</div>
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.DEPOSITED')}</div>
            <div className="header-block-middle">{currency}: {Number(depositAmount).toFixed(2)}</div>
          </DropdownItem>
          <DropdownItem>
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWAL')}</div>
            <div className="header-block-middle">{withdrawCount}</div>
            <div className="header-block-small margin-bottom-15">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}</div>
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.WITHDRAWN')}</div>
            <div className="header-block-middle">{currency}: {Number(withdrawAmount).toFixed(2)}</div>
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );

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
