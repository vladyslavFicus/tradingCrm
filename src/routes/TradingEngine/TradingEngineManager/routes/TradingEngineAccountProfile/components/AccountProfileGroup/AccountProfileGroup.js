import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import UpdateAccountMutation from './graphql/UpdateAccountMutation';
import TradingEngineGroupsQuery from './graphql/TradingEngineGroupsQuery';
import './AccountProfileGroup.scss';

class AccountProfileGroup extends PureComponent {
  static propTypes = {
    group: PropTypes.string,
    accountUuid: PropTypes.string.isRequired,
    groupsQuery: PropTypes.query({
      tradingEngineGroups: PropTypes.shape({
        groupName: PropTypes.string,
      }),
    }).isRequired,
    notify: PropTypes.func.isRequired,
    updateAccount: PropTypes.func.isRequired,
  }

  static defaultProps = {
    group: '',
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

  handleGroupChange = async (group) => {
    const {
      accountUuid,
      updateAccount,
      notify,
    } = this.props;

    try {
      await updateAccount({
        variables: {
          accountUuid,
          group,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_GROUP_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_GROUP_ERROR'),
      });
    }
  };

  renderLabel = () => (
    <div className="AccountProfileGroup__label">
      <div className="AccountProfileGroup__status">
        {this.props.group}
      </div>
    </div>
  );

  render() {
    const { isDropDownOpen } = this.state;

    const {
      groupsQuery: {
        data: groupsData,
      },
    } = this.props;

    const groups = groupsData?.tradingEngineGroups || [];

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
            {groups.map(({ groupName }) => (
              <DropdownItem
                className="AccountProfileGroup__dropdown-item"
                onClick={() => this.handleGroupChange(groupName)}
              >
                {I18n.t(groupName)}
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
    groupsQuery: TradingEngineGroupsQuery,
    updateAccount: UpdateAccountMutation,
  }),
)(AccountProfileGroup);
