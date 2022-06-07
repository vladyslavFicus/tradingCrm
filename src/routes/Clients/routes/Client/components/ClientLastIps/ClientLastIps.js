import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { uniqBy } from 'lodash';
import Flag from 'react-country-flag';
import PropTypes from 'constants/propTypes';
import CopyToClipboard from 'components/CopyToClipboard';
import './ClientLastIps.scss';

class ClientLastIps extends PureComponent {
  static propTypes = {
    lastSignInSessions: PropTypes.arrayOf(PropTypes.shape({
      ip: PropTypes.string,
      startedAt: PropTypes.string,
      countryCode: PropTypes.string,
    })).isRequired,
  }

  render() {
    const { lastSignInSessions } = this.props;

    const uniqueIps = uniqBy(lastSignInSessions, ({ ip }) => ip);

    return (
      <div className="ClientLastIps">
        <div className="ClientLastIps__title">
          {I18n.t('CLIENT_PROFILE.CLIENT.LAST_IPS.TITLE')}
        </div>

        <div className="ClientLastIps__content">
          {
            uniqueIps.map(({ ip, countryCode }) => (
              <div className="ClientLastIps__ip" key={ip}>
                <Flag
                  svg
                  countryCode={countryCode}
                  className="ClientLastIps__ip-flag"
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                  }}
                />
                <CopyToClipboard
                  text={ip}
                  withNotification
                  notificationTitle="CLIENT_PROFILE.CLIENT.LAST_IPS.NOTIFICATIONS.COPY.TITLE"
                  notificationMessage="CLIENT_PROFILE.CLIENT.LAST_IPS.NOTIFICATIONS.COPY.MESSAGE"
                >
                  <span>{ip}</span>
                </CopyToClipboard>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default ClientLastIps;
