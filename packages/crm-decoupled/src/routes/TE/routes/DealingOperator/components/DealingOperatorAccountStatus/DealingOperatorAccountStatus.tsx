import React, { useState } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Config, Utils, useModal, notify, LevelType, usePermission } from '@crm/common';
import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps } from 'modals/ChangeAccountStatusModal';
import { Operator } from '../../DealingOperator';
import { statusActions, statusesLabels } from './constants';
import { useChangeOperatorStatusMutation } from './graphql/__generated__/ChangeOperatorStatusMutation';
import './DealingOperatorAccountStatus.scss';

type Props = {
  operator: Operator,
};

const DealingOperatorAccountStatus = (props: Props) => {
  const { operator: { uuid, status } } = props;
  const [isDropDownOpen, toggleDropdown] = useState(false);
  const permission = usePermission();
  const isUpdateAllowedStatus = permission.allows(Config.permissions.WE_TRADING.OPERATORS_CHANGE_STATUS);
  const [changeAccountStatus] = useChangeOperatorStatusMutation();

  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

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

      Utils.EventEmitter.emit(Utils.OPERATOR_RELOAD);

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  const handleSelectStatus = (reasons: Record<string, string>, newStatus: OperatorStatusesEnum) => {
    changeAccountStatusModal.show({
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

export default React.memo(DealingOperatorAccountStatus);
