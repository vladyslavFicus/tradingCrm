import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import './ClientLastLogin.scss';

type Props = {
  profile: Profile,
};

const ClientLastLogin = (props: Props) => {
  const { profile } = props;

  const lastSignInSessions = profile.profileView?.lastSignInSessions;
  const lastSignInSession = lastSignInSessions && lastSignInSessions[lastSignInSessions.length - 1];
  const { startedAt = '', countryCode = '' } = lastSignInSession || {};

  return (
    <div className="ClientLastLogin">
      <div className="ClientLastLogin__title">{I18n.t('CLIENT_PROFILE.CLIENT.LAST_LOGIN.TITLE')}</div>

      <Choose>
        <When condition={!!lastSignInSession}>
          <If condition={!!startedAt}>
            <div className="ClientLastLogin__text-primary">
              {moment.utc(startedAt).local().fromNow()}
            </div>

            <div className="ClientLastLogin__text-secondary">
              {moment.utc(startedAt).local().format('DD.MM.YYYY HH:mm')}
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
