import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { Config, parseErrors, notify, Types, usePermission } from '@crm/common';
import { Profile } from '__generated__/types';
import { useUpdateClientTransferMutation } from '../graphql/__generated__/UpdateClientTransferMutation';

type FormValues = {
  internalTransfer: boolean,
};

type Props = {
  profile: Profile,
};

type UseClientTransferForm = {
  internalTransferValue: boolean,
  allowUpdateTransfer: boolean,
  handleSubmit: ({ internalTransfer }: FormValues) => void,
};

const useClientTransferForm = (props: Props): UseClientTransferForm => {
  const { profile } = props;

  const [internalTransferValue, setInternalTransferValue] = useState(!!profile.configuration?.internalTransfer);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateTransfer = permission.allows(Config.permissions.USER_PROFILE.CHANGE_CONFIGURATION);

  // ===== Requests ===== //
  const [updateClientTransferMutation] = useUpdateClientTransferMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async ({ internalTransfer }: FormValues) => {
    try {
      await updateClientTransferMutation({ variables: { playerUUID: profile.uuid, internalTransfer } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      setInternalTransferValue(internalTransfer);
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.TRANSFER_AVAILABILITY.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [profile.uuid, updateClientTransferMutation]);

  return {
    internalTransferValue,
    allowUpdateTransfer,
    handleSubmit,
  };
};

export default useClientTransferForm;
