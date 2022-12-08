import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import { notify, LevelType } from 'providers/NotificationProvider';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import EventEmitter, { OPERATOR_ACCOUNT_STATUS_CHANGED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import { statuses, statusesLabels, statusActions } from 'constants/operators';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import OperatorRelationsCountQuery from './graphql/OperatorRelationsCountQuery';
import OperatorAccountStatusMutation from './graphql/OperatorAccountStatusMutation';
import './OperatorAccountStatus.scss';

const updateAccountStatusPermissions = new Permissions(permissions.OPERATORS.UPDATE_STATUS);

class OperatorAccountStatus extends PureComponent {
  static propTypes = {
    operator: PropTypes.operator.isRequired,
    permission: PropTypes.permission.isRequired,
    changeAccountStatus: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      changeAccountStatusModal: PropTypes.modalType,
    }).isRequired,
    operatorRelationsCountQuery: PropTypes.query({
      operatorRelationsCount: PropTypes.shape({
        customersCount: PropTypes.number,
        leadsCount: PropTypes.number,
        rulesCount: PropTypes.number,
      }),
    }).isRequired,
  };

  state = {
    isDropDownOpen: false,
  };

  toggleDropdown = () => {
    this.setState(({ isDropDownOpen }) => ({ isDropDownOpen: !isDropDownOpen }));
  };

  handleChangeAccountStatus = async ({ reason }, status) => {
    const {
      modals: { changeAccountStatusModal },
      operator: { uuid },
      changeAccountStatus,
    } = this.props;

    try {
      await changeAccountStatus({
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

  handleSelectStatus = (reasons, action) => {
    const {
      modals: { changeAccountStatusModal },
    } = this.props;

    changeAccountStatusModal.show({
      reasons,
      message: action === 'CLOSED' ? this.renderMessages() : null,
      onSubmit: values => this.handleChangeAccountStatus(values, action),
    });
  };

  renderMessages = () => {
    const { operator, operatorRelationsCountQuery } = this.props;

    const { fullName } = operator;
    const { customersCount, leadsCount, rulesCount } = operatorRelationsCountQuery.data?.operatorRelationsCount || {};

    const messages = [
      { name: 'CLIENTS', link: '/clients/list', count: customersCount },
      { name: 'LEADS', link: '/leads/list', count: leadsCount },
      { name: 'RULES', link: '/sales-rules', count: rulesCount },
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
  }

  renderLabel = () => {
    const {
      operator: {
        operatorStatus,
        statusChangeDate,
        statusChangeAuthor,
      },
    } = this.props;

    return (
      <div className="OperatorAccountStatus__label">
        <div
          className={classNames('OperatorAccountStatus__status', {
            'OperatorAccountStatus__status--inactive': operatorStatus === statuses.INACTIVE,
            'OperatorAccountStatus__status--active': operatorStatus === statuses.ACTIVE,
            'OperatorAccountStatus__status--closed': operatorStatus === statuses.CLOSED,
          })}
        >
          {I18n.t(statusesLabels[operatorStatus])}
        </div>

        <If condition={operatorStatus === statuses.ACTIVE && statusChangeDate}>
          <div className="OperatorAccountStatus__additional">
            {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        </If>

        <If condition={operatorStatus === statuses.CLOSED && statusChangeAuthor}>
          <div className="OperatorAccountStatus__additional">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix="OP" />
          </div>
        </If>

        <If condition={operatorStatus === statuses.CLOSED && statusChangeDate}>
          <div className="OperatorAccountStatus__additional">
            on {moment.utc(statusChangeDate).local().format('DD.MM.YYYY')}
          </div>
        </If>
      </div>
    );
  }

  render() {
    const {
      operator: { operatorStatus },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { isDropDownOpen } = this.state;

    const updateAccountStatus = updateAccountStatusPermissions.check(currentPermissions);

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
          <When condition={updateAccountStatus && operatorStatus !== statuses.INACTIVE}>
            <Dropdown
              isOpen={isDropDownOpen}
              toggle={this.toggleDropdown}
            >
              <DropdownToggle tag="div">
                {this.renderLabel()}
                <i className="OperatorAccountStatus__arrow fa fa-angle-down" />
              </DropdownToggle>
              <DropdownMenu className="OperatorAccountStatus__dropdown-menu">
                {
                  statusActions[operatorStatus]
                    .map(({ label, reasons, action }) => (
                      <DropdownItem
                        key={action}
                        className="OperatorAccountStatus__dropdown-item"
                        onClick={() => this.handleSelectStatus(reasons, action)}
                      >
                        {I18n.t(label)}
                      </DropdownItem>
                    ))
                }
              </DropdownMenu>
            </Dropdown>
          </When>
          <Otherwise>
            {this.renderLabel()}
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withRequests({
    changeAccountStatus: OperatorAccountStatusMutation,
    operatorRelationsCountQuery: OperatorRelationsCountQuery,
  }),
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
)(OperatorAccountStatus);
