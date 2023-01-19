import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import './ClientLastLogin.scss';

type LastSignInSession = {
  startedAt: string,
  countryCode: string,
}

type Props = {
  lastSignInSession?: LastSignInSession,
}

const ClientLastLogin = (props: Props) => {
  const { lastSignInSession } = props;

  return (
    <div className="ClientLastLogin">
      <div className="ClientLastLogin__title">{I18n.t('CLIENT_PROFILE.CLIENT.LAST_LOGIN.TITLE')}</div>

      <Choose>
        <When condition={!!lastSignInSession}>
          <If condition={!!lastSignInSession?.startedAt}>
            <div className="ClientLastLogin__text-primary">
              {moment.utc(lastSignInSession?.startedAt).local().fromNow()}
            </div>

            <div className="ClientLastLogin__text-secondary">
              {moment.utc(lastSignInSession?.startedAt).local().format('DD.MM.YYYY HH:mm')}
            </div>
          </If>

          <If condition={!!lastSignInSession?.countryCode}>
            <div className="ClientLastLogin__text-secondary">
              {I18n.t('CLIENT_PROFILE.CLIENT.LAST_LOGIN.FROM_COUNTRY', { country: lastSignInSession?.countryCode })}
            </div>
          </If>
        </When>

        <Otherwise>
          <div className="ClientLastLogin__text-primary">{I18n.t('COMMON.UNAVAILABLE')}</div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(ClientLastLogin);
