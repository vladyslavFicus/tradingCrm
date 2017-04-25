import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';

class ProfileLastLogin extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    lastIp: PropTypes.ipEntity,
  };
  static defaultProps = {
    className: 'header-block',
    label: 'Last login',
  };

  render() {
    const {
      className,
      label,
      lastIp,
    } = this.props;

    return (
      <div className={className}>
        <div className="header-block-title">{label}</div>
        {
          !lastIp
            ? <div className="header-block-middle">Unavailable</div>
            : (
              <div>
                <div className="header-block-middle" key="time-ago">
                  {lastIp.signInDate && moment(lastIp.signInDate).fromNow()}
                </div>
                <div className="header-block-small">
                  {lastIp.signInDate && moment(lastIp.signInDate).format('DD.MM.YYYY hh:mm')}
                </div>
                <div className="header-block-small">
                  {lastIp.country && ` from ${lastIp.country}`}
                </div>
              </div>
          )
        }
      </div>
    );
  }
}

export default ProfileLastLogin;
