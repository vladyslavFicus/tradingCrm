import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Uuid from 'components/Uuid';
import { statusColorNames, statuses } from 'constants/operators';
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
    refetchOperator: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onSendInvitationClick: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    loginLock: PropTypes.shape({
      lock: PropTypes.bool,
    }).isRequired,
  };

  handleStatusChange = async (data) => {
    const { data: profileData, onStatusChange, refetchOperator } = this.props;
    await onStatusChange({ ...data, uuid: profileData.uuid });
    refetchOperator();
  };

  render() {
    const {
      data: {
        uuid,
        firstName,
        lastName,
        country,
        registrationDate,
        operatorStatus,
        statusChangeDate,
        statusChangeAuthor,
      },
      availableStatuses,
      onResetPasswordClick,
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
              {`${firstName} ${lastName}`}
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
                {I18n.t('OPERATOR_PROFILE.PROFILE.HEADER.UNLOCK')}
              </button>
            </If>
            {
              operatorStatus === statuses.INACTIVE &&
              <PermissionContent permissions={permissions.OPERATORS.OPERATOR_SEND_INVITATION}>
                <Button
                  className="btn-sm btn-default-outline margin-right-10"
                  onClick={onSendInvitationClick}
                >
                  Send Invitation
                </Button>
              </PermissionContent>
            }
            {
              operatorStatus === statuses.ACTIVE &&
              <PermissionContent permissions={permissions.OPERATORS.RESET_PASSWORD}>
                <Button
                  className="btn-sm btn-default-outline"
                  onClick={onResetPasswordClick}
                >
                  Reset Password
                </Button>
              </PermissionContent>
            }
          </div>
        </div>
        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <AccountStatus
              profileStatus={operatorStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <div className="header-block-title">Account Status</div>
                  <If condition={availableStatuses.length > 0}>
                    <PermissionContent permissions={permissions.OPERATORS.UPDATE_STATUS}>
                      <i className="fa fa-angle-down" />
                    </PermissionContent>
                  </If>
                  <div className={`header-block-middle ${statusColorNames[operatorStatus]}`}>{operatorStatus}</div>
                  {
                    operatorStatus === statuses.ACTIVE && !!statusChangeDate &&
                    <div className="header-block-small">
                      Since {moment.utc(statusChangeDate).local().format('DD.MM.YYYY')}
                    </div>
                  }
                  {
                    operatorStatus === statuses.CLOSED &&
                    <div>
                      {
                        statusChangeAuthor &&
                        <div className="header-block-small">
                          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix="OP" />
                        </div>
                      }
                      {
                        statusChangeDate &&
                        <div className="header-block-small">
                          on {moment.utc(statusChangeDate).local().format('DD.MM.YYYY')}
                        </div>
                      }
                    </div>
                  }
                </div>
              }
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block">
            <div className="header-block-title">Registered</div>
            {
              registrationDate &&
              <div>
                <div className="header-block-middle">
                  {moment.utc(registrationDate).local().fromNow()}
                </div>
                <div className="header-block-small">
                  on {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
