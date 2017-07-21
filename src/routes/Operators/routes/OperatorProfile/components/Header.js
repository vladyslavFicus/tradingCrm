import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../../components/Uuid';
import { statusColorNames, statuses } from '../../../../../constants/operators';
import AccountStatus from './AccountStatus';
import ProfileLastLogin from './ProfileLastLogin';
import PropTypes from '../../../../../constants/propTypes';
import PermissionContent from '../../../../../components/PermissionContent';
import Permissions from '../../../../../utils/permissions';
import permission from '../../../../../config/permissions';

const sendInvitationRequiredPermissions = new Permissions([permission.OPERATORS.OPERATOR_SEND_INVITATION]);

class Header extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    lastIp: PropTypes.operatorIpEntity,
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
  static defaultProps = {
    lastIp: null,
  };

  handleStatusChange = (data) => {
    const { data: profileData, onStatusChange } = this.props;

    onStatusChange({ ...data, uuid: profileData.uuid });
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
      lastIp,
      availableStatuses,
      onResetPasswordClick,
      onSendInvitationClick,
    } = this.props;

    return (
      <div className="operator-profile-header">
        <div className="panel-heading-row">
          <div className="panel-heading-row__info">
            <div className="panel-heading-row__info-title">{`${firstName} ${lastName}`}</div>
            <span className="panel-heading-row__info-ids">
              {!!uuid && <Uuid uuid={uuid} />} {country && ` - ${country}`}
            </span>
          </div>
          <div className="panel-heading-row__actions">
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
        <div className="panel-heading">
          <div className="row">
            <div className="header-block header-block_account">
              <AccountStatus
                profileStatus={operatorStatus}
                onStatusChange={this.handleStatusChange}
                label={
                  <div className="dropdown-tab">
                    <div className="header-block-title">Account Status</div>
                    {availableStatuses.length > 0 && <i className="fa fa-angle-down" />}
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
                            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={statusChangeAuthor} uuidPrefix={'OP'} />
                          </div>
                        }
                        {
                          statusChangeDate &&
                          <div className="header-block-small">
                            on {moment(statusChangeDate).format('DD.MM.YYYY')}
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
                    {moment(registrationDate).fromNow()}
                  </div>
                  <div className="header-block-small">
                    on {moment(registrationDate).format('DD.MM.YYYY HH:mm')}
                  </div>
                </div>
              }
            </div>
            <ProfileLastLogin className="header-block" lastIp={lastIp} />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
