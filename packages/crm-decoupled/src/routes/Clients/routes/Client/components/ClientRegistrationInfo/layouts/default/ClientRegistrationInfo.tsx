import React from 'react';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import useClientRegistrationInfo from 'routes/Clients/routes/Client/components/hooks/useClientRegistrationInfo';
import './ClientRegistrationInfo.scss';

type Props = {
  profile: Profile,
};

const ClientRegistrationInfo = (_props: Props) => {
  const { registrationDate, timeFromNow, formatDate } = useClientRegistrationInfo(_props);

  return (
    <div className="ClientRegistrationInfo">
      <div className="ClientRegistrationInfo__title">
        {I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}
      </div>

      <If condition={!!registrationDate}>
        <div className="ClientRegistrationInfo__general">
          {timeFromNow}
        </div>

        <div className="ClientRegistrationInfo__additional">
          {I18n.t('COMMON.ON')} {formatDate}
        </div>
      </If>
    </div>
  );
};

export default React.memo(ClientRegistrationInfo);
