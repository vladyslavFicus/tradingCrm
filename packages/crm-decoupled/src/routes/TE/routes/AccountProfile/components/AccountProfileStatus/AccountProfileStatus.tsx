import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Config, usePermission, notify, LevelType } from '@crm/common';
import { Account } from '../../AccountProfile';
import { useUpdateAccountReadonlyMutation } from './graphql/__generated__/UpdateAccountReadonlyMutation';
import './AccountProfileStatus.scss';

type Props = {
  account: Account,
};

const AccountProfileStatus = (props: Props) => {
  const {
    account: {
      readOnly,
      enable,
    },
  } = props;

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
    const { account } = props;

    try {
      await updateAccountReadonly({
        variables: {
          accountUuid: account.uuid,
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
        {I18n.t(`COMMON.${readOnly ? 'DISABLED' : 'ENABLED'}`)}
      </div>
    </div>
  );

  return (
    <Choose>
      <When condition={permission.allows(Config.permissions.WE_TRADING.ACCOUNT_READ_ONLY) && enable}>
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

export default React.memo(AccountProfileStatus);
