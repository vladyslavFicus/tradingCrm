import React, { useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import EventEmitter, { OPERATOR_ACCOUNT_STATUS_CHANGED } from 'utils/EventEmitter';
import { statuses, statusesLabels, statusActions } from 'constants/operators';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { useOperatorRelationsCountQuery } from './graphql/__generated__/OperatorRelationsCountQuery';
import { useOperatorAccountStatusMutation } from './graphql/__generated__/OperatorAccountStatusMutation';
import './OperatorAccountStatus.scss';

// TODO After rewriting ChangeAccountStatusModal
// use useModal hook and use FormValues type from ChangeAccountStatusModal
type FormValues = {
  reason: string,
  comment?: string,
};

type Props = {
  operator: Operator,
  modals: {
    changeAccountStatusModal: Modal,
  },
};

const OperatorAccountStatus = (props: Props) => {
  const {
    operator: {
      uuid,
      fullName,
      operatorStatus,
      statusChangeDate,
      statusChangeAuthor,
    },
    modals: {
      changeAccountStatusModal,
    },
  } = props;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const permission = usePermission();

  const allowUpdateAccountStatus = permission.allows(permissions.OPERATORS.UPDATE_STATUS);

  const actions = statusActions[operatorStatus as statuses] || [];

  // ===== Requests ===== //
  const [operatorAccountStatusMutation] = useOperatorAccountStatusMutation();

  const operatorRelationsCountQuery = useOperatorRelationsCountQuery({ variables: { uuid } });

  const { customersCount, leadsCount, rulesCount } = operatorRelationsCountQuery.data?.operatorRelationsCount || {};

  const getMessages = () => {
    const messages = [
      { name: 'CLIENTS', link: '/clients/list', count: customersCount || 0 },
      { name: 'LEADS', link: '/leads/list', count: leadsCount || 0 },
      { name: 'RULES', link: '/sales-rules', count: rulesCount || 0 },
    ].filter(({ count }) => count > 0);

    return (
      <If condition={messages.length > 0}>
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
    );
  };

  // ===== Handlers ===== //
  const toggleDropdown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleChangeAccountStatus = async ({ reason }: FormValues, status: string) => {
    try {
      await operatorAccountStatusMutation({
        variables: {
          uuid,
          status,
          reason,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      EventEmitter.emit(OPERATOR_ACCOUNT_STATUS_CHANGED);

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  const handleSelectStatus = (reasons: Record<string, string>, action: string) => {
    changeAccountStatusModal.show({
      reasons,
      message: action === 'CLOSED' ? getMessages() : null,
      onSubmit: (values: FormValues) => handleChangeAccountStatus(values, action),
    });
  };

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
                  onClick={() => handleSelectStatus(reasons, action)}
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

export default compose(
  React.memo,
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
)(OperatorAccountStatus);
