import React, { useState } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withModals, withNotifications } from 'hoc';
import { Notify, Modal, LevelType } from 'types';
import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import EventEmitter, { OPERATOR_RELOAD } from 'utils/EventEmitter';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { Operator } from '../../DealingOperator';
import { statusActions, statusesLabels } from './constants';
import { useChangeOperatorStatusMutation } from './graphql/__generated__/ChangeOperatorStatusMutation';
import './DealingOperatorAccountStatus.scss';

type Props = {
  operator: Operator,
  notify: Notify,
  modals: {
    changeStatusModal: Modal,
  },
}

const DealingOperatorAccountStatus = (props: Props) => {
  const [isDropDownOpen, toggleDropdown] = useState(false);
  const { operator: { uuid, status }, notify, modals: { changeStatusModal } } = props;
  const permission = usePermission();
  const isUpdateAllowedStatus = permission.allows(permissions.WE_TRADING.OPERATORS_CHANGE_STATUS);
  const [changeAccountStatus] = useChangeOperatorStatusMutation();

  const handleChangeAccountStatus = async (reason: string, newStatus: OperatorStatusesEnum) => {
    try {
      await changeAccountStatus({
        variables: {
          uuid,
          status: newStatus,
          reason,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      EventEmitter.emit(OPERATOR_RELOAD);

      changeStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  const handleSelectStatus = (reasons: Record<string, string>, newStatus: OperatorStatusesEnum) => {
    changeStatusModal.show({
      reasons,
      onSubmit: ({ reason }: { reason: string }) => handleChangeAccountStatus(reason, newStatus),
    });
  };


  const renderLabel = () => (
    <div className="DealingOperatorAccountStatus__label">
      <div
        className={classNames('DealingOperatorAccountStatus__status', {
          'DealingOperatorAccountStatus__status--inactive': status === OperatorStatusesEnum.INACTIVE,
          'DealingOperatorAccountStatus__status--active': status === OperatorStatusesEnum.ACTIVE,
          'DealingOperatorAccountStatus__status--closed': status === OperatorStatusesEnum.CLOSED,
        })}
      >
        {I18n.t(statusesLabels[status])}
      </div>
    </div>
  );

  return (
    <div
      className={
        classNames('DealingOperatorAccountStatus', {
          'DealingOperatorAccountStatus--with-open-dropdown': isDropDownOpen,
        })
      }
    >
      <div className="DealingOperatorAccountStatus__title">
        {I18n.t('COMMON.ACCOUNT_STATUS')}
      </div>

      <Choose>
        <When condition={isUpdateAllowedStatus && status !== OperatorStatusesEnum.INACTIVE}>
          <Dropdown
            isOpen={isDropDownOpen}
            toggle={() => toggleDropdown(!isDropDownOpen)}
          >
            <DropdownToggle tag="div">
              {renderLabel()}
              <i className="DealingOperatorAccountStatus__arrow fa fa-angle-down" />
            </DropdownToggle>
            <DropdownMenu className="DealingOperatorAccountStatus__dropdown-menu">
              {
                statusActions[status]
                  .map(({ label, reasons, action }) => (
                    <DropdownItem
                      key={action}
                      className="DealingOperatorAccountStatus__dropdown-item"
                      onClick={() => handleSelectStatus(reasons, action)}
                    >
                      {I18n.t(label)}
                    </DropdownItem>
                  ))
              }
            </DropdownMenu>
          </Dropdown>
        </When>
        <Otherwise>
          {renderLabel()}
        </Otherwise>
      </Choose>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
  withModals({
    changeStatusModal: ChangeAccountStatusModal,
  }),
)(DealingOperatorAccountStatus);
