import React, { PureComponent } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';

class ProfileLastLogin extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    lastIp: PropTypes.operatorIpEntity,
  };
  static defaultProps = {
    className: 'header-block',
    lastIp: null,
  };

  render() {
    const {
      className,
      lastIp,
    } = this.props;

    return (
      <div className={className}>
        <div className="header-block-title">{I18n.t('PROFILE.LAST_LOGIN.TITLE')}</div>
        {
          !lastIp
            ? <div className="header-block-middle">{I18n.t('COMMON.UNAVAILABLE')}</div>
            : (
              <div>
                <div className="header-block-middle" key="time-ago">
                  {lastIp.signInDate && moment.utc(lastIp.signInDate).local().fromNow()}
                </div>
                <div className="header-block-small">
                  {lastIp.signInDate && moment.utc(lastIp.signInDate).local().format('DD.MM.YYYY HH:mm')}
                </div>
                <div className="header-block-small">
                  {lastIp.country && I18n.t('PROFILE.LAST_LOGIN.FROM_COUNTRY', { country: lastIp.country })}
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

export default ProfileLastLogin;
