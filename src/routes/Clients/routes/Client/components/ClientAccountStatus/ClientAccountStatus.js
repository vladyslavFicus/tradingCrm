import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { statuses, statusColorNames, statusesLabels, statusActions } from 'constants/user';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import FailureReasonIcon from 'components/FailureReasonIcon';
import Uuid from 'components/Uuid';
import ChangeClientStatusMutation from './graphql/ChangeClientStatusMutation';
import './ClientAccountStatus.scss';

const updateAccountStatusPermissions = new Permissions(permissions.USER_PROFILE.STATUS);

class ClientAccountStatus extends PureComponent {
  static propTypes = {
    client: PropTypes.profile.isRequired,
    changeAccountStatus: PropTypes.func.isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
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

  handleSelectStatus = (reasons, action) => {
    const {
      modals: { changeAccountStatusModal },
    } = this.props;

    changeAccountStatusModal.show({
      reasons,
      onSubmit: values => this.handleChangeAccountStatus(values, action),
      withComment: true,
    });
  };

  handleChangeAccountStatus = async ({ reason, comment }, action) => {
    const {
      notify,
      client: { uuid },
      changeAccountStatus,
      modals: { changeAccountStatusModal },
    } = this.props;

    try {
      await changeAccountStatus({
        variables: {
          uuid,
          reason,
          comment,
          status: action,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  };

  renderLabel = () => {
    const { client } = this.props;
    const { type, changedAt, changedBy } = client?.status || {};

    return (
      <div className="ClientAccountStatus__label">
        <div className={classNames('ClientAccountStatus__status', statusColorNames[type])}>
          {I18n.t(statusesLabels[type])}
        </div>

        <If condition={changedAt}>
          <div className="ClientAccountStatus__secondary">
            {I18n.t('COMMON.SINCE', { date: moment.utc(changedAt).local().format('DD.MM.YYYY') })}
          </div>
        </If>

        <If condition={changedBy}>
          <div className="ClientAccountStatus__secondary">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={changedBy} uuidPrefix="OP" />
          </div>
        </If>
      </div>
    );
  }

  render() {
    const {
      client,
      permission: { permissions: currentPermissions },
    } = this.props;

    const { isDropDownOpen } = this.state;

    const updateAccountStatus = updateAccountStatusPermissions.check(currentPermissions);

    const {
      changedAt,
      changedBy,
      comment,
      reason,
      type,
    } = client?.status || {};

    const statusesOptions = type
      ? statusActions[type].filter(action => (new Permissions([action.permission])).check(currentPermissions))
      : [];

    return (
      <div
        className={
          classNames('ClientAccountStatus', {
            'ClientAccountStatus--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="ClientAccountStatus__title">
          {I18n.t('COMMON.ACCOUNT_STATUS')}
        </div>

        <Choose>
          <When condition={updateAccountStatus && statusesOptions.length}>
            <Dropdown
              isOpen={isDropDownOpen}
              toggle={this.toggleDropdown}
            >
              <DropdownToggle tag="div">
                {this.renderLabel()}
                <i className="ClientAccountStatus__arrow fa fa-angle-down" />
              </DropdownToggle>
              <DropdownMenu className="ClientAccountStatus__dropdown-menu">
                {
                  statusesOptions.map(({ label, reasons, action }) => (
                    <DropdownItem
                      key={action}
                      className="ClientAccountStatus__dropdown-item"
                      onClick={() => this.handleSelectStatus(reasons, action)}
                    >
                      {I18n.t(label)}
                    </DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>

            <If condition={type === statuses.BLOCKED}>
              <FailureReasonIcon
                reason={reason}
                statusDate={moment.utc(changedAt).local().format('YYYY-MM-DD HH:mm:ss')}
                statusAuthor={changedBy}
                profileStatusComment={comment}
              />
            </If>
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
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
  withRequests({
    changeAccountStatus: ChangeClientStatusMutation,
  }),
)(ClientAccountStatus);
