import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withNotifications } from 'hoc';
import { LevelType, Notify } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { leverages } from './constants';
import { useUpdateAccountLeverageMutation } from './graphql/__generated__/UpdateAccountLeverageMutation';
import './AccountProfileLeverage.scss';

type Props = {
  leverage: number,
  accountUuid: string,
  notify: Notify,
}

const AccountProfileLeverage = (props: Props) => {
  const { leverage = 0 } = props;
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
    const { notify, accountUuid } = props;
    try {
      await updateAccountLeverage({
        variables: {
          accountUuid,
          leverage: value,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_LEVERAGE_SUCCESS'),
      });
    } catch (_) {
      notify({
        level: LevelType.ERROR,
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
      <When condition={permission.allows(permissions.WE_TRADING.UPDATE_ACCOUNT_LEVERAGE)}>
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

export default compose(
  React.memo,
  withNotifications,
)(AccountProfileLeverage);