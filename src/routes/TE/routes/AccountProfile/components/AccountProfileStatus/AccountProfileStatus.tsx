import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { LevelType, Notify } from 'types';
import { withNotifications } from 'hoc';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useUpdateAccountReadonlyMutation } from './graphql/__generated__/UpdateAccountReadonlyMutation';
import './AccountProfileStatus.scss';

type Props = {
  enable: boolean,
  accountUuid: string,
  notify: Notify,
}

const AccountProfileStatus = (props: Props) => {
  const { enable = true } = props;
  const [isDropDownOpen, setDropdownState] = useState(false);
  const [updateAccountReadonly] = useUpdateAccountReadonlyMutation();
  const permission = usePermission();

  const toggleDropdown = (e: any) => {
    if (e) {
      e.stopPropagation();
    }

    setDropdownState(!isDropDownOpen);
  };

  const handleStatusChange = async (action: boolean) => {
    const { notify, accountUuid } = props;

    try {
      await updateAccountReadonly({
        variables: {
          accountUuid,
          readOnly: action,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_STATUS_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_STATUS_ERROR'),
      });
    }
  };

  const renderLabel = () => (
    <div className="AccountProfileStatus__label">
      <div className="AccountProfileStatus__status">
        {I18n.t(`COMMON.${enable ? 'DISABLED' : 'ENABLED'}`)}
      </div>
    </div>
  );

  return (
    <Choose>
      <When condition={permission.allows(permissions.WE_TRADING.ACCOUNT_READ_ONLY)}>
        <div
          onClick={toggleDropdown}
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
            toggle={toggleDropdown}
          >
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="AccountProfileStatus__arrow fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="AccountProfileStatus__dropdown-menu">
              <DropdownItem
                className="AccountProfileStatus__dropdown-item"
                onClick={() => handleStatusChange(false)}
              >
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ENABLE')}
              </DropdownItem>
              <DropdownItem
                className="AccountProfileStatus__dropdown-item"
                onClick={() => handleStatusChange(true)}
              >
                {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.DISABLE')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </When>
      <Otherwise>
        <div className="AccountProfileStatus">
          <div className="AccountProfileStatus__title">
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ALLOW_TRADING')}
          </div>

          {renderLabel()}
        </div>
      </Otherwise>
    </Choose>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(AccountProfileStatus);
