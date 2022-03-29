import React from 'react';
import I18n from 'i18n-js';
import ReactSwitch from 'components/ReactSwitch';
import {
  useUpdateConfigurationDepositMutation,
} from './graphql/__generated__/UpdateConfigurationDepositMutation';
import './ClientDepositSwitcher.scss';

interface Props {
  uuid: string;
  enabled: boolean;
}

const ClientDepositSwitcher = ({ uuid, enabled }: Props) => {
  const [updateConfigurationDeposit] = useUpdateConfigurationDepositMutation();
  const handleSetupDepositMutation = (value: boolean) => updateConfigurationDeposit({
    variables: { playerUUID: uuid, enabled: value },
  });

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

export default ClientDepositSwitcher;
