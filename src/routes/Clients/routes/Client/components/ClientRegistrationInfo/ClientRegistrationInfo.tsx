import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Profile } from '__generated__/types';
import './ClientRegistrationInfo.scss';

type Props = {
  profile: Profile,
};

const ClientRegistrationInfo = (props: Props) => {
  const { profile } = props;

  const registrationDate = profile.registrationDetails.registrationDate || '';

  return (
    <div className="ClientRegistrationInfo">
      <div className="ClientRegistrationInfo__title">
        {I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}
      </div>

      <If condition={!!registrationDate}>
        <div className="ClientRegistrationInfo__general">
          {moment.utc(registrationDate).local().fromNow()}
        </div>

        <div className="ClientRegistrationInfo__additional">
          {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
      </If>
    </div>
  );
};

export default React.memo(ClientRegistrationInfo);
