import React from 'react';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import useClientLastLogin from 'routes/Clients/routes/Client/components/hooks/useClientLastLogin';
import './ClientLastLogin.scss';

type Props = {
  profile: Profile,
};

const ClientLastLogin = (_props: Props) => {
  const {
    lastSignInSession,
    startedAt,
    countryCode,
    timeFromNow,
    formatDate,
  } = useClientLastLogin(_props);

  return (
    <div className="ClientLastLogin">
      <div className="ClientLastLogin__title">{I18n.t('CLIENT_PROFILE.CLIENT.LAST_LOGIN.TITLE')}</div>

      <Choose>
        <When condition={!!lastSignInSession}>
          <If condition={!!startedAt}>
            <div className="ClientLastLogin__text-primary">
              {timeFromNow}
            </div>

            <div className="ClientLastLogin__text-secondary">
              {formatDate}
            </div>
          </If>

          <If condition={!!countryCode}>
            <div className="ClientLastLogin__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.LAST_LOGIN.FROM_COUNTRY', { country: countryCode })}
            </div>
          </If>
        </When>

        <Otherwise>
          <div className="ClientLastLogin__text-primary">
            {I18n.t('COMMON.UNAVAILABLE')}
          </div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(ClientLastLogin);
