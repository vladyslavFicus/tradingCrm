import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Config, Utils } from '@crm/common';
import { Input } from 'components';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Account } from '../../AccountProfile';
import { useUpdateAccountGroupMutation } from './graphql/__generated__/UpdateAccountGroupMutation';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import './AccountProfileGroup.scss';

type Props = {
  account: Account,
};

const AccountProfileGroup = (props: Props) => {
  const {
    account: {
      group,
      enable,
    },
  } = props;

  const [isDropDownOpen, setDropdownState] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [updateAccountGroup] = useUpdateAccountGroupMutation();
  const permission = usePermission();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const groupsQuery = useGroupsQuery({
    variables: {
      args: {
        enabled: true,
        page: {
          from: 0,
          size: 100000,
        },
      },
    },
  });
  const groups = groupsQuery.data?.tradingEngine.groups.content || [];

  const toggleDropdown = (e: any) => {
    if (e) {
      e.stopPropagation();
    }

    setSearchVal('');
    setDropdownState(!isDropDownOpen);
  };

  const handleGroupChange = async (value: string, force = false) => {
    const { account } = props;
    try {
      await updateAccountGroup({
        variables: {
          accountUuid: account.uuid,
          group: value,
          force,
        },
      });

      Utils.EventEmitter.emit(Utils.ORDER_RELOAD);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_GROUP_SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      // Open confirmation modal to confirm force closing orders
      if (error.error === 'error.account.has.opened.orders') {
        confirmActionModal.show({
          actionText: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ACCOUNT_HAS_OPEN_ORDERS'),
          submitButtonLabel: I18n.t('COMMON.YES'),
          cancelButtonLabel: I18n.t('COMMON.NO'),
          onSubmit: () => handleGroupChange(value, true),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: error.error === 'error.account.group.change'
            || error.error === 'error.account.group.change.incorrect-currency'
            ? error.message : I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_GROUP_ERROR'),
        });
      }
    }
  };

  const filteredGroupNames = groups.filter(item => item.groupName.toLowerCase().includes(searchVal.toLowerCase()));

  const renderLabel = () => (
    <div className="AccountProfileGroup__label">
      <div className="AccountProfileGroup__status">
        {group}
      </div>
    </div>
  );

  return (
    <Choose>
      <When condition={permission.allows(Config.permissions.WE_TRADING.UPDATE_ACCOUNT_GROUP) && enable}>
        <div
          onClick={toggleDropdown}
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
            toggle={toggleDropdown}
          >
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="AccountProfileGroup__arrow fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="AccountProfileGroup__dropdown-menu">
              <div className="AccountProfileGroup__wrapper">
                <div
                  className="AccountProfileGroup__filter"
                  onClick={((e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation())}
                >
                  <Input
                    autoFocus
                    name="groupName"
                    data-testid="AccountProfileGroup-groupNameInput"
                    className="AccountProfileGroup__filter-input"
                    addition={<i className="icon icon-search" />}
                    value={searchVal}
                    onChange={((e: React.ChangeEvent<HTMLInputElement>) => setSearchVal(e.target.value))}
                    placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.SEARCH')}
                  />
                </div>
                {filteredGroupNames.map(({ groupName }) => (
                  <DropdownItem
                    key={groupName}
                    className="AccountProfileGroup__dropdown-item"
                    onClick={() => handleGroupChange(groupName)}
                  >
                    {groupName}
                  </DropdownItem>
                ))}
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </When>
      <Otherwise>
        <div className="AccountProfileGroup">
          <div className="AccountProfileGroup__title">
            {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.GROUP')}
          </div>

          {renderLabel()}
        </div>
      </Otherwise>
    </Choose>
  );
};


export default React.memo(AccountProfileGroup);
