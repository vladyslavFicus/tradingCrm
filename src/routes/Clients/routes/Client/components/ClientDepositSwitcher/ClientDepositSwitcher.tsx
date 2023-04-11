import React from 'react';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import ReactSwitch from 'components/ReactSwitch';
import { useUpdateConfigurationDepositMutation } from './graphql/__generated__/UpdateConfigurationDepositMutation';
import './ClientDepositSwitcher.scss';

type Props = {
  profile: Profile,
};

const ClientDepositSwitcher = (props: Props) => {
  const { profile } = props;

  const playerUUID = profile.uuid;
  const enabled = !!profile.configuration.depositEnabled;

  // ===== Requests ===== //
  const [updateConfigurationDeposit] = useUpdateConfigurationDepositMutation();

  // ===== Handlers ===== //
  const handleSetupDepositMutation = (value: boolean) => {
    try {
      updateConfigurationDeposit({ variables: { playerUUID, enabled: value } });
    } catch {
      // # do nothing...
    }
  };

  return (
    <div className="ClientDepositSwitcher">
      <ReactSwitch
        className="ClientDepositSwitcher__label"
        label={I18n.t('CLIENT_PROFILE.CLIENT.CAN_DEPOSIT')}
        on={enabled}
        stopPropagation
        onClick={handleSetupDepositMutation}
      />
    </div>
  );
};

export default React.memo(ClientDepositSwitcher);
