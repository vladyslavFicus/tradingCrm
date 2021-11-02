import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { leverages } from './constants';
import UpdateAccountMutation from './graphql/UpdateAccountMutation';
import './AccountProfileLeverage.scss';

class AccountProfileLeverage extends PureComponent {
  static propTypes = {
    leverage: PropTypes.number,
    accountUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    updateAccount: PropTypes.func.isRequired,
  }

  static defaultProps = {
    leverage: 0,
  };

  state = {
    isDropDownOpen: false,
  };

  toggleDropdown = (e) => {
    if (e) {
      e.stopPropagation();
    }

    this.setState(({ isDropDownOpen }) => ({ isDropDownOpen: !isDropDownOpen }));
  }

  handleLeverageChange = async (leverage) => {
    const {
      notify,
      accountUuid,
      updateAccount,
    } = this.props;

    try {
      await updateAccount({
        variables: {
          accountUuid,
          leverage,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_LEVERAGE_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_LEVERAGE_ERROR'),
      });
    }
  };

  renderLabel = () => (
    <div className="AccountProfileLeverage__label">
      <div className="AccountProfileLeverage__status">
        {`1:${this.props.leverage}`}
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
                onClick={() => this.handleLeverageChange(leverage)}
              >
                {`1:${leverage}`}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    updateAccount: UpdateAccountMutation,
  }),
)(AccountProfileLeverage);
