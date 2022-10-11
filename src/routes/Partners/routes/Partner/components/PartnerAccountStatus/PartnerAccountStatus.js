import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import Uuid from 'components/Uuid';
import { statuses, statusesLabels, statusActions } from '../../constants';
import PartnerAccountStatusMutation from './graphql/PartnerAccountStatusMutation';
import './PartnerAccountStatus.scss';

const updateAccountStatusPermissions = new Permissions(permissions.PARTNERS.UPDATE_STATUS);

class PartnerAccountStatus extends PureComponent {
  static propTypes = {
    partner: PropTypes.partner.isRequired,
    refetchPartner: PropTypes.func.isRequired,
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
      partner: { uuid },
      changeAccountStatus,
      refetchPartner,
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
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      refetchPartner();
      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  };

  handleSelectStatus = (reasons, action) => {
    const {
      modals: { changeAccountStatusModal },
    } = this.props;

    changeAccountStatusModal.show({
      reasons,
      onSubmit: values => this.handleChangeAccountStatus(values, action),
    });
  };

  renderLabel = () => {
    const {
      partner: {
        status,
        statusChangeDate,
        statusChangeAuthor,
      },
    } = this.props;

    return (
      <div className="PartnerAccountStatus__label">
        <div
          className={classNames('PartnerAccountStatus__status', {
            'PartnerAccountStatus__status--inactive': status === statuses.INACTIVE,
            'PartnerAccountStatus__status--active': status === statuses.ACTIVE,
            'PartnerAccountStatus__status--closed': status === statuses.CLOSED,
          })}
        >
          {I18n.t(statusesLabels[status])}
        </div>

        <If condition={status === statuses.ACTIVE && statusChangeDate}>
          <div className="PartnerAccountStatus__additional">
            {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        </If>

        <If condition={status === statuses.CLOSED && statusChangeAuthor}>
          <div className="PartnerAccountStatus__additional">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix="OP" />
          </div>
        </If>

        <If condition={status === statuses.CLOSED && statusChangeDate}>
          <div className="PartnerAccountStatus__additional">
            on {moment.utc(statusChangeDate).local().format('DD.MM.YYYY')}
          </div>
        </If>
      </div>
    );
  }

  render() {
    const {
      partner: { status },
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { isDropDownOpen } = this.state;

    const updateAccountStatus = updateAccountStatusPermissions.check(currentPermissions);

    return (
      <div
        className={
          classNames('PartnerAccountStatus', {
            'PartnerAccountStatus--with-open-dropdown': isDropDownOpen,
          })
        }
      >
        <div className="PartnerAccountStatus__title">
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
                <i className="PartnerAccountStatus__arrow fa fa-angle-down" />
              </DropdownToggle>
              <DropdownMenu className="PartnerAccountStatus__dropdown-menu">
                {
                  statusActions
                    .filter(statusAction => statusAction.status !== status)
                    .map(({ label, reasons, action }) => (
                      <DropdownItem
                        key={action}
                        className="PartnerAccountStatus__dropdown-item"
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
    changeAccountStatus: PartnerAccountStatusMutation,
  }),
  withModals({
    changeAccountStatusModal: ChangeAccountStatusModal,
  }),
)(PartnerAccountStatus);
