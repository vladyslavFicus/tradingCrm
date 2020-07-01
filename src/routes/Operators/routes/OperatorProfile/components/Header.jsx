import React, { Component } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import { statusColorNames, statuses, statusesLabels } from 'constants/operators';
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
    onChangePasswordClick: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
    loginLock: PropTypes.shape({
      lock: PropTypes.bool,
    }).isRequired,
    refetchLoginLock: PropTypes.func.isRequired,
  };

  handleStatusChange = async ({ reason, status }) => {
    const { data: profileData, onStatusChange, refetchOperator, refetchLoginLock } = this.props;
    await onStatusChange({
      variables: {
        reason,
        status,
        uuid: profileData.uuid,
      },
    });
    refetchOperator();
    refetchLoginLock();
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
      onChangePasswordClick,
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
            <If condition={lock && operatorStatus !== 'CLOSED'}>
              <Button
                onClick={unlockLogin}
                primary
                small
                className="margin-right-10"
              >
                {I18n.t('OPERATOR_PROFILE.PROFILE.HEADER.UNLOCK')}
              </Button>
            </If>
            {
              operatorStatus === statuses.ACTIVE
              && (
                <PermissionContent permissions={permissions.OPERATORS.RESET_PASSWORD}>
                  <Button
                    onClick={onResetPasswordClick}
                    className="margin-right-10"
                    primary
                    small
                  >
                    {I18n.t('OPERATOR_PROFILE.RESET_PASSWORD')}
                  </Button>
                </PermissionContent>
              )
            }
            <PermissionContent permissions={permissions.OPERATORS.CHANGE_PASSWORD}>
              <Button
                onClick={onChangePasswordClick}
                primary
                small
              >
                {I18n.t('OPERATOR_PROFILE.CHANGE_PASSWORD')}
              </Button>
            </PermissionContent>
          </div>
        </div>
        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <AccountStatus
              profileStatus={operatorStatus}
              onStatusChange={this.handleStatusChange}
              label={(
                <div className="dropdown-tab">
                  <div className="header-block-title">{I18n.t('COMMON.ACCOUNT_STATUS')}</div>
                  <If condition={availableStatuses.length > 0}>
                    <PermissionContent permissions={permissions.OPERATORS.UPDATE_STATUS}>
                      <i className="fa fa-angle-down" />
                    </PermissionContent>
                  </If>
                  <div className={`header-block-middle ${statusColorNames[operatorStatus]}`}>
                    {I18n.t(statusesLabels[operatorStatus])}
                  </div>
                  {
                    operatorStatus === statuses.ACTIVE && !!statusChangeDate
                    && (
                      <div className="header-block-small">
                        {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
                      </div>
                    )
                  }
                  {
                    operatorStatus === statuses.CLOSED
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
              registrationDate
              && (
                <div>
                  <div className="header-block-middle">
                    {moment.utc(registrationDate).local().fromNow()}
                  </div>
                  <div className="header-block-small">
                    {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
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
