import React, { PureComponent } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

class ProfileLastLogin extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    lastIp: PropTypes.ipEntity,
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
        <Choose>
          <When condition={!lastIp}>
            <div className="header-block-middle">{I18n.t('COMMON.UNAVAILABLE')}</div>
          </When>
          <Otherwise>
            <div className="header-block-middle" key="time-ago">
              {lastIp.startedAt && moment.utc(lastIp.startedAt).local().fromNow()}
            </div>
            <div className="header-block-small">
              {lastIp.startedAt && moment.utc(lastIp.startedAt).local().format('DD.MM.YYYY HH:mm')}
            </div>
            <div className="header-block-small">
              {lastIp.countryCode && I18n.t('PROFILE.LAST_LOGIN.FROM_COUNTRY', { country: lastIp.countryCode })}
            </div>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default ProfileLastLogin;
