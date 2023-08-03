import React from 'react';
import I18n from 'i18n-js';
import Flag from 'react-country-flag';
import { Profile } from '__generated__/types';
import CopyToClipboard from 'components/CopyToClipboard';
import useClientLastIps from 'routes/Clients/routes/Client/components/hooks/useClientLastIps';
import './ClientLastIps.scss';

type Props = {
  profile: Profile,
};

const ClientLastIps = (_props: Props) => {
  const { uniqueIps } = useClientLastIps(_props);

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

              <If condition={!!ip}>
                <CopyToClipboard
                  text={ip || ''}
                  withNotification
                  notificationTitle="CLIENT_PROFILE.CLIENT.LAST_IPS.NOTIFICATIONS.COPY.TITLE"
                  notificationMessage="CLIENT_PROFILE.CLIENT.LAST_IPS.NOTIFICATIONS.COPY.MESSAGE"
                >
                  <span>{ip}</span>
                </CopyToClipboard>
              </If>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default React.memo(ClientLastIps);
