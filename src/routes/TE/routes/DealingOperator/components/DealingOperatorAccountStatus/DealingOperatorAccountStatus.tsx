import React, { useState } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';
import { Operator } from '../../DealingOperator';
import { statusActions, statusesLabels } from './constants';
import './DealingOperatorAccountStatus.scss';

type Props = {
  operator: Operator,
}

const DealingOperatorAccountStatus = (props: Props) => {
  const [isDropDownOpen, toggleDropdown] = useState(false);
  const { operator: { status } } = props;

  const renderLabel = () => (
    <div className="DealingOperatorAccountStatus__label">
      <div className={classNames('DealingOperatorAccountStatus__status', statusesLabels[status].color)}>
        {I18n.t(statusesLabels[status].label)}
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
        <When condition={status !== OperatorStatusesEnum.INACTIVE}>
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
                      onClick={() => console.log(reasons, action)}
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
