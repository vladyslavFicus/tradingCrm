import { useCallback } from 'react';
import { Profile } from '__generated__/types';
import { useUpdateConfigurationDepositMutation } from '../graphql/__generated__/UpdateConfigurationDepositMutation';

type Props = {
  profile: Profile,
};

type UseClientDepositSwitcher = {
  enabled: boolean,
  handleSetupDepositMutation: (value: boolean) => void,
};

const useClientDepositSwitcher = (props: Props): UseClientDepositSwitcher => {
  const { profile } = props;

  const playerUUID = profile.uuid;
  const enabled = !!profile.configuration.depositEnabled;

  // ===== Requests ===== //
  const [updateConfigurationDeposit] = useUpdateConfigurationDepositMutation();

  // ===== Handlers ===== //
  const handleSetupDepositMutation = useCallback((value: boolean) => {
    try {
      updateConfigurationDeposit({ variables: { playerUUID, enabled: value } });
    } catch {
      // # do nothing...
    }
  }, [playerUUID, updateConfigurationDeposit]);

  return {
    enabled,
    handleSetupDepositMutation,
  };
};

export default useClientDepositSwitcher;
