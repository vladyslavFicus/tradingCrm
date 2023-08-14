import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { Config, parseErrors, notify, Types, usePermission } from '@crm/common';
import { Profile } from '__generated__/types';
import { useUpdateClientKycMutation } from '../graphql/__generated__/UpdateClientKycMutation';

type FormValues = {
  kycStatus: string,
};

type Props = {
  profile: Profile,
};

type UseClientKycForm = {
  kycStatusValue: string,
  handleSubmit: ({ kycStatus }: FormValues) => void,
  allowUpdateKycStatus: boolean,
};

const useClientKycForm = (props: Props): UseClientKycForm => {
  const { profile } = props;

  const [kycStatusValue, setKycStatusValue] = useState(profile.kyc?.status || '');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateKycStatus = permission.allows(Config.permissions.USER_PROFILE.KYC_UPDATE);

  // ===== Requests ===== //
  const [updateClientKycMutation] = useUpdateClientKycMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async ({ kycStatus }: FormValues) => {
    try {
      await updateClientKycMutation({ variables: { playerUUID: profile.uuid, kycStatus } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.SUCCESS_RESPONSE'),
      });

      setKycStatusValue(kycStatus);
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [profile.uuid, updateClientKycMutation]);

  return {
    kycStatusValue,
    handleSubmit,
    allowUpdateKycStatus,
  };
};

export default useClientKycForm;
