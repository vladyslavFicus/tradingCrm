import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { leverages } from './constants';
import './AccountProfileLeverage.scss';

class AccountProfileLeverage extends PureComponent {
  state = {
    isDropDownOpen: false,
  };

  toggleDropdown = (e) => {
    if (e) {
      e.stopPropagation();
    }

    this.setState(({ isDropDownOpen }) => ({ isDropDownOpen: !isDropDownOpen }));
  }

  renderLabel = () => (
    <div className="AccountProfileLeverage__label">
      <div className="AccountProfileLeverage__status">
        1:100
      </div>
    </div>
  );

  render() {
    const { isDropDownOpen } = this.state;

    return (
      <div
        onClick={this.toggleDropdown}
        className={
          classNames('AccountProfileLeverage', {
            'AccountProfileLeverage--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="AccountProfileLeverage__title">
          {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.LEVERAGE')}
        </div>

        <Dropdown
          isOpen={isDropDownOpen}
          toggle={this.toggleDropdown}
        >
          <DropdownToggle tag="div">
            {this.renderLabel()}
            <i className="AccountProfileLeverage__arrow fa fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu className="AccountProfileLeverage__dropdown-menu">
            {leverages.map((leverage, index) => (
              <DropdownItem
                key={index}
                className="AccountProfileLeverage__dropdown-item"
                onClick={() => {}}
              >
                {leverage}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}


export default AccountProfileLeverage;
