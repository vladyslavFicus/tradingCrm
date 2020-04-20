import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import I18n from 'i18n-js';
import Uuid from 'components/Uuid';
import { statusColorNames, statuses, statusesLabels } from 'constants/partners';
import PropTypes from 'constants/propTypes';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import AccountStatus from './AccountStatus';

class Header extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    availableStatuses: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string,
      label: PropTypes.string,
      role: PropTypes.string,
      reasons: PropTypes.object,
    })).isRequired,
    onStatusChange: PropTypes.func.isRequired,
    refetchPartner: PropTypes.func.isRequired,
    onChangePasswordClick: PropTypes.func.isRequired,
    onSendInvitationClick: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    loginLock: PropTypes.shape({
      lock: PropTypes.bool,
    }).isRequired,
  };

  handleStatusChange = async ({ reason, status }) => {
    const { data: { uuid }, onStatusChange, refetchPartner } = this.props;

    await onStatusChange({
      variables: {
        reason,
        status,
        uuid,
      },
    });
    refetchPartner();
  };

  render() {
    const {
      data: {
        uuid,
        status,
        country,
        fullName,
        createdAt,
        statusChangeDate,
        statusChangeAuthor,
      },
      availableStatuses,
      onChangePasswordClick,
      onSendInvitationClick,
      unlockLogin,
      loginLock: {
        lock,
      },
    } = this.props;

    return (
      <div>
        <div className="row no-gutters panel-heading-row">
          <div className="col panel-heading-row__info">
            <div
              className="panel-heading-row__info-title"
              id="operators-account-name"
            >
              {fullName}
            </div>
            <span className="panel-heading-row__info-ids">
              {!!uuid && <Uuid uuid={uuid} />} {country && ` - ${country}`}
            </span>
          </div>
          <div className="col-auto panel-heading-row__actions">
            <If condition={lock}>
              <button
                onClick={unlockLogin}
                type="button"
                className="btn btn-sm mx-3 btn-primary"
              >
                {I18n.t('PARTNER_PROFILE.PROFILE.HEADER.UNLOCK')}
              </button>
            </If>
            <If condition={status === statuses.INACTIVE}>
              {/* Here is no API functional to SEND_INVITATION anymore */}
              <PermissionContent permissions={permissions.OPERATORS.OPERATOR_SEND_INVITATION}>
                <Button
                  className="btn-sm btn-default-outline margin-right-10"
                  onClick={onSendInvitationClick}
                >
                  {I18n.t('PARTNER_PROFILE.DETAILS.SEND_INVITATION')}
                </Button>
              </PermissionContent>
            </If>
            <PermissionContent permissions={permissions.PARTNERS.CHANGE_PASSWORD}>
              <Button
                className="btn-sm btn-default-outline"
                onClick={onChangePasswordClick}
              >
                {I18n.t('PARTNER_PROFILE.CHANGE_PASSWORD')}
              </Button>
            </PermissionContent>
          </div>
        </div>
        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <AccountStatus
              profileStatus={status}
              onStatusChange={this.handleStatusChange}
              label={(
                <div className="dropdown-tab header-block-inner">
                  <div className="header-block-title">{I18n.t('COMMON.ACCOUNT_STATUS')}</div>
                  <If condition={availableStatuses.length > 0}>
                    <PermissionContent permissions={permissions.PARTNERS.UPDATE_STATUS}>
                      <i className="fa fa-angle-down" />
                    </PermissionContent>
                  </If>
                  <div className={`header-block-middle ${statusColorNames[status]}`}>
                    {I18n.t(statusesLabels[status])}
                  </div>
                  {
                    status === statuses.ACTIVE && !!statusChangeDate
                    && (
                      <div className="header-block-small">
                        {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
                      </div>
                    )
                  }
                  {
                    status === statuses.CLOSED
                    && (
                      <div>
                        {
                          statusChangeAuthor
                        && (
                          <div className="header-block-small">
                            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix="OP" />
                          </div>
                        )
                        }
                        {
                          statusChangeDate
                        && (
                          <div className="header-block-small">
                          on {moment.utc(statusChangeDate).local().format('DD.MM.YYYY')}
                          </div>
                        )
                        }
                      </div>
                    )
                  }
                </div>
              )}
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('OPERATORS.GRID_HEADER.REGISTERED')}</div>
            {
              createdAt
              && (
                <div>
                  <div className="header-block-middle">
                    {moment.utc(createdAt).local().fromNow()}
                  </div>
                  <div className="header-block-small">
                    {I18n.t('COMMON.ON')} {moment.utc(createdAt).local().format('DD.MM.YYYY HH:mm')}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
