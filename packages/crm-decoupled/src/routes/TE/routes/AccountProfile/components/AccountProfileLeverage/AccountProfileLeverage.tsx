import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Config, usePermission, notify, Types } from '@crm/common';
import { Account } from '../../AccountProfile';
import { useUpdateAccountLeverageMutation } from './graphql/__generated__/UpdateAccountLeverageMutation';
import { leverages } from './constants';
import './AccountProfileLeverage.scss';

type Props = {
  account: Account,
};

const AccountProfileLeverage = (props: Props) => {
  const {
    account: {
      leverage,
      enable,
    },
  } = props;

  const [isDropDownOpen, setDropDownState] = useState(false);
  const [updateAccountLeverage] = useUpdateAccountLeverageMutation();
  const permission = usePermission();

  const toggleDropdown = (e: any) => {
    if (e) {
      e.stopPropagation();
    }

    setDropDownState(!isDropDownOpen);
  };

  const handleLeverageChange = async (value: number) => {
    const { account } = props;
    try {
      await updateAccountLeverage({
        variables: {
          accountUuid: account.uuid,
          leverage: value,
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_LEVERAGE_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAILED'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_LEVERAGE_ERROR'),
      });
    }
  };

  const renderLabel = () => (
    <div className="AccountProfileLeverage__label">
      <div className="AccountProfileLeverage__status">
        {`1:${leverage}`}
      </div>
    </div>
  );

  return (
    <Choose>
      <When condition={permission.allows(Config.permissions.WE_TRADING.UPDATE_ACCOUNT_LEVERAGE) && enable}>
        <div
          onClick={toggleDropdown}
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
            toggle={toggleDropdown}
          >
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="AccountProfileLeverage__arrow fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="AccountProfileLeverage__dropdown-menu">
              {leverages.map((value, index) => (
                <DropdownItem
                  key={index}
                  className="AccountProfileLeverage__dropdown-item"
                  onClick={() => handleLeverageChange(value)}
                >
                  {`1:${value}`}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </When>
      <Otherwise>
        <div className="AccountProfileLeverage">
          <div className="AccountProfileLeverage__title">
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.LEVERAGE')}
          </div>

          {renderLabel()}
        </div>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(AccountProfileLeverage);
