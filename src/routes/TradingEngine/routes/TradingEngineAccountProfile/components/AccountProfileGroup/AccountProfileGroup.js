import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import './AccountProfileGroup.scss';

class AccountProfileGroup extends PureComponent {
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
    <div className="AccountProfileGroup__label">
      <div className="AccountProfileGroup__status">
        0-USD
      </div>
    </div>
  );

  render() {
    const { isDropDownOpen } = this.state;

    return (
      <div
        onClick={this.toggleDropdown}
        className={
          classNames('AccountProfileGroup', {
            'AccountProfileGroup--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="AccountProfileGroup__title">
          {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.GROUP')}
        </div>

        <Dropdown
          isOpen={isDropDownOpen}
          toggle={this.toggleDropdown}
        >
          <DropdownToggle tag="div">
            {this.renderLabel()}
            <i className="AccountProfileGroup__arrow fa fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu className="AccountProfileGroup__dropdown-menu">
            <DropdownItem
              className="AccountProfileGroup__dropdown-item"
              onClick={() => {}}
            >
              0-USD
            </DropdownItem>
            <DropdownItem
              className="AccountProfileGroup__dropdown-item"
              onClick={() => {}}
            >
              0-EUR
            </DropdownItem>
            <DropdownItem
              className="AccountProfileGroup__dropdown-item"
              onClick={() => {}}
            >
              Demo-Test-USD
            </DropdownItem>
            <DropdownItem
              className="AccountProfileGroup__dropdown-item"
              onClick={() => {}}
            >
              Demo-Test-EUR
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}


export default AccountProfileGroup;
