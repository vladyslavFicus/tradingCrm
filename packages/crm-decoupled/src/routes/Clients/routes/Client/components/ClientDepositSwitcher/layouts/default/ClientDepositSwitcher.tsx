import React from 'react';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import ReactSwitch from 'components/ReactSwitch';
import useClientDepositSwitcher from 'routes/Clients/routes/Client/components/hooks/useClientDepositSwitcher';
import './ClientDepositSwitcher.scss';

type Props = {
  profile: Profile,
};

const ClientDepositSwitcher = (_props: Props) => {
  const {
    enabled,
    handleSetupDepositMutation,
  } = useClientDepositSwitcher(_props);

  return (
    <div className="ClientDepositSwitcher">
      <ReactSwitch
        className="ClientDepositSwitcher__label"
        data-testid="ClientDepositSwitcher-canDepositSwitch"
        label={I18n.t('CLIENT_PROFILE.CLIENT.CAN_DEPOSIT')}
        on={enabled}
        stopPropagation
        onClick={handleSetupDepositMutation}
      />
    </div>
  );
};

export default React.memo(ClientDepositSwitcher);
