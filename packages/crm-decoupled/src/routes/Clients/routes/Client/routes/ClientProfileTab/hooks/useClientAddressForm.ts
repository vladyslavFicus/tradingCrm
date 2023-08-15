import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { Config, parseErrors, notify, Types, usePermission, Utils } from '@crm/common';
import { Profile } from '__generated__/types';
import { FormValues } from '../types/clientAddressForm';
import { useUpdateClientAddressMutation } from '../graphql/__generated__/UpdateClientAddressMutation';

type Props = {
  profile: Profile,
};

type UseClientAddressForm = {
  clientAddress: FormValues,
  handleSubmit: (values: FormValues) => void,
  allowUpdateAddress: boolean,
};

const useClientAddressForm = (props: Props): UseClientAddressForm => {
  const { profile } = props;

  const [clientAddress, setClientAddress] = useState<FormValues>({
    countryCode: '',
    city: '',
    poBox: '',
    postCode: '',
    address: '',
  });

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateAddress = permission.allows(Config.permissions.USER_PROFILE.UPDATE_ADDRESS);

  // ===== Requests ===== //
  const [updateClientAddressMutation] = useUpdateClientAddressMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      await updateClientAddressMutation({
        variables: {
          playerUUID: profile.uuid,
          ...Utils.decodeNullValues(values),
        },
      });

      setClientAddress(values);

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [profile.uuid, updateClientAddressMutation]);

  return {
    clientAddress,
    handleSubmit,
    allowUpdateAddress,
  };
};

export default useClientAddressForm;
