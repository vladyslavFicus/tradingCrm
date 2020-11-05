import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import EventEmitter, { OPERATOR_ACCOUNT_STATUS_CHANGED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import { statuses, statusesLabels, statusActions, statusColorNames } from 'constants/operators';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import Uuid from 'components/Uuid';
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
    notify: PropTypes.func.isRequired,
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
      notify,
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
        level: 'success',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      EventEmitter.emit(OPERATOR_ACCOUNT_STATUS_CHANGED);

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  handleSelectStatus = (reasons, action) => {
    const {
      operator: { uuid, fullName },
      modals: { changeAccountStatusModal },
    } = this.props;

    changeAccountStatusModal.show({
      uuid,
      fullName,
      reasons,
      onSubmit: values => this.handleChangeAccountStatus(values, action),
    });
  };

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
        <div className={classNames('OperatorAccountStatus__status', statusColorNames[operatorStatus])}>
          {I18n.t(statusesLabels[operatorStatus])}
        </div>

        <If condition={operatorStatus === statuses.ACTIVE && statusChangeDate}>
          <div className="OperatorAccountStatus__secondary">
            {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        </If>

        <If condition={operatorStatus === statuses.CLOSED && statusChangeAuthor}>
          <div className="OperatorAccountStatus__secondary">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix="OP" />
          </div>
        </If>

        <If condition={operatorStatus === statuses.CLOSED && statusChangeDate}>
          <div className="OperatorAccountStatus__secondary">
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
          <When condition={updateAccountStatus}>
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
  withNotifications,
  withRequests({
    changeAccountStatus: OperatorAccountStatusMutation,
  }),
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
)(OperatorAccountStatus);
