import I18n from 'i18n-js';
import { useCallback } from 'react';
import { Config, parseErrors, notify, Types, usePermission, Utils } from '@crm/common';
import { Profile } from '__generated__/types';
import { useUpdateClientPersonalMutation } from '../graphql/__generated__/UpdateClientPersonalMutation';

type FormValues = {
  firstName: string,
  lastName: string,
  gender: string,
  birthDate: string,
  languageCode: string,
  timeZone: string,
  identificationNumber: string,
  termsAccepted: boolean | null,
  passport: {
    number: string,
    expirationDate: string,
    countryOfIssue: string,
    issueDate: string,
    countrySpecificIdentifier: string,
    countrySpecificIdentifierType: string,
  },
};

type Props = {
  profile: Profile,
}

type UseClientPersonalForm = {
  allowUpdatePersonalInformation: boolean,
  handleSubmit: (values: FormValues) => void,
};

const useClientPersonalForm = (props: Props): UseClientPersonalForm => {
  const { profile } = props;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdatePersonalInformation = permission.allows(Config.permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION);

  // ===== Requests ===== //
  const [updateClientPersonalMutation] = useUpdateClientPersonalMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      await updateClientPersonalMutation({
        variables: {
          playerUUID: profile.uuid,
          ...Utils.decodeNullValues(values),
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [profile.uuid, updateClientPersonalMutation]);

  return {
    allowUpdatePersonalInformation,
    handleSubmit,
  };
};

export default useClientPersonalForm;
