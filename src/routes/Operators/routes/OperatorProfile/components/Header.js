import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import { shortify } from '../../../../../utils/uuid';
import { statusColorNames, statuses } from '../../../../../constants/operators';
import AccountStatus from './AccountStatus';
import PropTypes from '../../../../../constants/propTypes';
import PermissionContent from '../../../../../components/PermissionContent';
import Permissions from '../../../../../utils/permissions';
import permission from '../../../../../config/permissions';
import './Header.scss';

const sendInvitationRequiredPermissions = new Permissions([permission.OPERATORS.OPERATOR_SEND_INVITATION]);

class Header extends Component {
  static propTypes = {
    data: PropTypes.object,
    lastIp: PropTypes.ipEntity,
    availableStatuses: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.string,
      label: PropTypes.string,
      role: PropTypes.string,
      reasons: PropTypes.array,
    })).isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    onSendInvitationClick: PropTypes.func.isRequired,
  };

  handleStatusChange = (data) => {
    const { data: profileData, onStatusChange } = this.props;

    onStatusChange({ ...data, uuid: profileData.uuid });
  };

  renderLastLogin = () => {
    const { lastIp } = this.props;
    return !lastIp
      ? 'Unavailable'
      : [
        <div
          key="time-ago"
          className="header-block-middle"
        >
          {lastIp.signInDate && moment(lastIp.signInDate).fromNow()}
        </div>,
        <div
          key="time"
          className="header-block-small"
        >
          {lastIp.signInDate && ` on ${moment(lastIp.signInDate).format('DD.MM.YYYY hh:mm')}`}
        </div>,
        <div
          key="country"
          className="header-block-small"
        >
          {lastIp.country && ` from ${lastIp.country}`}
        </div>,
      ];
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
    } = this.props;

    return (
      <div className="operator-profile-header">
        <div className="panel-heading-row">
          <div className="panel-heading-row_name-and-ids">
            <div className="operator-profile-info-name">{`${firstName} ${lastName}`}</div>
            <span className="operator-profile-info-id">
              { shortify(uuid) } { country && ` - ${country}` }
            </span>
          </div>
          <div className="operator-profile-actions">
            {
              operatorStatus === statuses.INACTIVE &&
              <PermissionContent permissions={sendInvitationRequiredPermissions}>
                <Button
                  className="btn-default-outline margin-right-10"
                  onClick={onSendInvitationClick}
                >
                  Send Invitation
                </Button>
              </PermissionContent>
            }
            {
              operatorStatus === statuses.ACTIVE &&
              <Button
                className="btn-default-outline"
                onClick={onResetPasswordClick}
              >
                Reset Password
              </Button>
            }
          </div>
        </div>
        <div className="row panel-heading header-blocks">
          <div className="header-block header-block_account col-xs-3 padding-0">
            <AccountStatus
              profileStatus={operatorStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <div className="header-block-title">Account Status</div><i className="fa fa-angle-down" />
                  <div className={`header-block-middle ${statusColorNames[operatorStatus]}`}>{operatorStatus}</div>
                  {
                    operatorStatus === statuses.ACTIVE && !!statusChangeDate &&
                    <div className="header-block-small">
                      Since {moment(statusChangeDate).format('DD.MM.YYYY')}
                    </div>
                  }
                  {
                    operatorStatus === statuses.CLOSED &&
                    <div>
                      {
                        statusChangeAuthor &&
                        <div className="header-block-small">
                          by { shortify(statusChangeAuthor, 'OP') }
                        </div>
                      }
                      {
                        statusChangeDate &&
                        <div className="header-block-small">
                          on { moment(statusChangeDate).format('MM.DD.YYYY') }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block col-xs-3">
            <div className="header-block-title">Registered</div>
            {
              registrationDate &&
              <div>
                <div className="header-block-middle">
                  { moment(registrationDate).fromNow() }
                </div>
                <div className="header-block-small">
                  on { moment(registrationDate).format('YYYY-MM-DD HH:mm') }
                </div>
              </div>
            }
          </div>
          <div className="header-block col-xs-6">
            <div className="header-block-title">Last Login</div>
            {this.renderLastLogin()}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
