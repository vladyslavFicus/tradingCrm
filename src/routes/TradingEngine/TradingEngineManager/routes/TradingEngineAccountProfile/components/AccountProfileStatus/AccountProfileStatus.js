import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import ChangeAccountSettingsMutation from './graphql/ChangeAccountSettingsMutation';
import './AccountProfileStatus.scss';

class AccountProfileStatus extends PureComponent {
  static propTypes = {
    enable: PropTypes.bool,
    accountUuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    changeAccountSettings: PropTypes.func.isRequired,
  }

  static defaultProps = {
    enable: true,
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

  handleSelectStatus = async (action) => {
    const {
      notify,
      accountUuid,
      changeAccountSettings,
    } = this.props;

    try {
      await changeAccountSettings({
        variables: {
          accountUuid,
          readOnly: action,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_STATUS_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_STATUS_ERROR'),
      });
    }
  };

  renderLabel = () => (
    <div className="AccountProfileStatus__label">
      <div className="AccountProfileStatus__status">
        {I18n.t(`COMMON.${this.props.enable ? 'ENABLED' : 'DISABLED'}`)}
      </div>
    </div>
  );

  render() {
    const { isDropDownOpen } = this.state;

    return (
      <div
        onClick={this.toggleDropdown}
        className={
          classNames('AccountProfileStatus', {
            'AccountProfileStatus--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="AccountProfileStatus__title">
          {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ALLOW_TRADING')}
        </div>

        <Dropdown
          isOpen={isDropDownOpen}
          toggle={this.toggleDropdown}
        >
          <DropdownToggle tag="div">
            {this.renderLabel()}
            <i className="AccountProfileStatus__arrow fa fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu className="AccountProfileStatus__dropdown-menu">
            <DropdownItem
              className="AccountProfileStatus__dropdown-item"
              onClick={() => this.handleSelectStatus(true)}
            >
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ENABLE')}
            </DropdownItem>
            <DropdownItem
              className="AccountProfileStatus__dropdown-item"
              onClick={() => this.handleSelectStatus(false)}
            >
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.DISABLE')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}


export default compose(
  withNotifications,
  withRequests({
    changeAccountSettings: ChangeAccountSettingsMutation,
  }),
)(AccountProfileStatus);
