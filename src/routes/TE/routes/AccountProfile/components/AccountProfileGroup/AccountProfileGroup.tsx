import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { parseErrors } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { LevelType, Modal, Notify } from 'types';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { useUpdateAccountGroupMutation } from './graphql/__generated__/UpdateAccountGroupMutation';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import './AccountProfileGroup.scss';

type Props = {
  group: string,
  accountUuid: string,
  notify: Notify,
  modals: {
    confirmationModal: Modal,
  },
}

const AccountProfileGroup = (props: Props) => {
  const {
    group = '',
    modals: { confirmationModal },
  } = props;

  const [isDropDownOpen, setDropdownState] = React.useState(false);
  const [updateAccountGroup] = useUpdateAccountGroupMutation();
  const permission = usePermission();

  const groupsQuery = useGroupsQuery({
    variables: {
      args: {
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

    setDropdownState(!isDropDownOpen);
  };

  const handleGroupChange = async (value: string, force = false) => {
    const { accountUuid, notify } = props;
    try {
      await updateAccountGroup({
        variables: {
          accountUuid,
          group: value,
          force,
        },
      });

      EventEmitter.emit(ORDER_RELOAD);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.NOTIFICATIONS.CHANGE_GROUP_SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      // Open confirmation modal to confirm force closing orders
      if (error.error === 'error.account.has.opened.orders') {
        confirmationModal.show({
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

  const renderLabel = () => (
    <div className="AccountProfileGroup__label">
      <div className="AccountProfileGroup__status">
        {group}
      </div>
    </div>
  );

  return (
    <Choose>
      <When condition={permission.allows(permissions.WE_TRADING.UPDATE_ACCOUNT_GROUP)}>
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
              {groups.map(({ groupName }) => (
                <DropdownItem
                  key={groupName}
                  className="AccountProfileGroup__dropdown-item"
                  onClick={() => handleGroupChange(groupName)}
                >
                  {I18n.t(groupName)}
                </DropdownItem>
              ))}
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


export default compose(
  React.memo,
  withNotifications,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(AccountProfileGroup);
