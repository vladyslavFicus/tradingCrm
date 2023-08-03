import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Operator } from '__generated__/types';
import { statuses, statusesLabels } from 'constants/operators';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import useOperatorAccountStatus from 'routes/Operators/routes/hooks/useOperatorAccountStatus';
import './OperatorAccountStatus.scss';

type Props = {
  operator: Operator,
  onRefetch: () => void,
};

const OperatorAccountStatus = (_props: Props) => {
  const {
    operator: {
      fullName,
      operatorStatus,
      statusChangeDate,
      statusChangeAuthor,
    },
  } = _props;

  const {
    allowUpdateAccountStatus,
    isDropDownOpen,
    actions,
    messages,
    toggleDropdown,
    handleSelectStatus,
  } = useOperatorAccountStatus(_props);

  const getMessages = useCallback(() => (
    <If condition={!!messages.length}>
      <ul
        className={classNames('OperatorAccountStatus__modal-warning', {
          'OperatorAccountStatus__modal-warning--list': messages.length > 1,
        })}
      >
        <b>{fullName}</b>

        {messages.map(({ name, link, count }) => (
          <li key={name}>
            {I18n.t(`OPERATOR_PROFILE.MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.BEFORE_LINK`, { count })}

            <Link to={link}>
              {I18n.t(`OPERATOR_PROFILE.MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.LINK`)}
            </Link>

            {I18n.t(`OPERATOR_PROFILE.MODALS.CHANGE_ACCOUNT_STATUS_MODAL.WARNING_${name}.AFTER_LINK`)}
          </li>
        ))}
      </ul>
    </If>
  ), [messages]);

  // ===== Renders ===== //
  const renderLabel = () => (
    <div className="OperatorAccountStatus__label">
      <div
        className={classNames('OperatorAccountStatus__status', {
          'OperatorAccountStatus__status--inactive': operatorStatus === statuses.INACTIVE,
          'OperatorAccountStatus__status--active': operatorStatus === statuses.ACTIVE,
          'OperatorAccountStatus__status--closed': operatorStatus === statuses.CLOSED,
        })}
      >
        {I18n.t(statusesLabels[operatorStatus as statuses])}
      </div>

      <If condition={operatorStatus === statuses.ACTIVE && !!statusChangeDate}>
        <div className="OperatorAccountStatus__additional">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY') })}
        </div>
      </If>

      <If condition={operatorStatus === statuses.CLOSED && !!statusChangeAuthor}>
        <div className="OperatorAccountStatus__additional">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor || ''} uuidPrefix="OP" />
        </div>
      </If>

      <If condition={operatorStatus === statuses.CLOSED && !!statusChangeDate}>
        <div className="OperatorAccountStatus__additional">
          {I18n.t('COMMON.ON')} {moment.utc(statusChangeDate || '').local().format('DD.MM.YYYY')}
        </div>
      </If>
    </div>
  );

  return (
    <div
      className={
        classNames('OperatorAccountStatus', {
          'OperatorAccountStatus--with-open-dropdown': isDropDownOpen,
        })
      }
    >
      <div className="OperatorAccountStatus__title">
        {I18n.t('COMMON.ACCOUNT_STATUS')}
      </div>

      <Choose>
        <When condition={allowUpdateAccountStatus && operatorStatus !== statuses.INACTIVE}>
          <Dropdown
            isOpen={isDropDownOpen}
            toggle={toggleDropdown}
          >
            <DropdownToggle tag="div">
              {renderLabel()}

              <i className="OperatorAccountStatus__arrow fa fa-angle-down" />
            </DropdownToggle>

            <DropdownMenu className="OperatorAccountStatus__dropdown-menu">
              {actions.map(({ label, reasons, action }) => (
                <DropdownItem
                  key={action}
                  className="OperatorAccountStatus__dropdown-item"
                  onClick={() => handleSelectStatus(reasons, action, getMessages)}
                >
                  {I18n.t(label)}
                </DropdownItem>
              ))}
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

export default React.memo(OperatorAccountStatus);
