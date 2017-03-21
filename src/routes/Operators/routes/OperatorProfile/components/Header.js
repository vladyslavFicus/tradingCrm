import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import { shortify } from '../../../../../utils/uuid';
import { statusColorNames } from '../../../../../constants/operators';
import AccountStatus from './AccountStatus';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    data: PropTypes.object,
    lastIp: PropTypes.object,
    availableStatuses: PropTypes.array.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  handleStatusChange = (data) => {
    const { data: profileData, onStatusChange } = this.props;

    onStatusChange({ ...data, playerUUID: profileData.uuid });
  };

  renderLastLogin = () => {
    const { lastIp } = this.props;
    return !lastIp
      ? 'Unavailable'
      : [
        <div
          key="time-ago"
          className="header-block-text"
        >
          {lastIp.signInDate && moment(lastIp.signInDate).fromNow()}
        </div>,
        <div
          key="time"
          className="header-block-secondary-text"
        >
          {lastIp.signInDate && ` on ${moment(lastIp.signInDate).format('DD.MM.YYYY hh:mm')}`}
        </div>,
        <div
          key="country"
          className="header-block-secondary-text"
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
      },
      availableStatuses,
    } = this.props;

    return (
      <div className="operator-profile-header">
        <div className="row panel-heading">
          <div className="operator-profile-info">
            <h3 className="operator-profile-info-name">{`${firstName} ${lastName}`}</h3>
            <span className="operator-profile-info-id">
              { shortify(uuid) } { country && ` - ${country}` }
            </span>
          </div>
          <div className="operator-profile-actions">
            <Button className="operator-profile-actions-button btn-default-outline">Send Invitation</Button>
            <Button className="operator-profile-actions-button btn-default-outline">Reset Password</Button>
          </div>
        </div>
        <div className="row panel-heading header-blocks">
          <div className="header-block">
            <AccountStatus
              profileStatus={operatorStatus}
              onStatusChange={this.handleStatusChange}
              label={
                <div className="dropdown-tab">
                  <div className="header-block-title">Account Status</div>
                  <div className={`header-block-text ${statusColorNames[operatorStatus]}`}>{operatorStatus}</div>
                  {
                    !!statusChangeDate &&
                    <small>
                      Since {moment(statusChangeDate).format('DD.MM.YYYY')}
                    </small>
                  }
                </div>
              }
              availableStatuses={availableStatuses}
            />
          </div>
          <div className="header-block width-33">
            <div className="header-block-title">Registered</div>
            {
              registrationDate &&
              <div>
                <div className="header-block-text">
                  { moment(registrationDate).fromNow() }
                </div>
                <div className="header-block-secondary-text">
                  on { moment(registrationDate).format('YYYY-MM-DD HH:mm') }
                </div>
              </div>
            }
          </div>
          <div className="header-block width-33">
            <div className="header-block-title">Last Login</div>
            {this.renderLastLogin()}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
