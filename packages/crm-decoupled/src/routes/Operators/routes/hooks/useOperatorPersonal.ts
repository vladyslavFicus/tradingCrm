import { useCallback } from 'react';
import I18n from 'i18n-js';
import { Config, notify, LevelType, usePermission } from '@crm/common';
import { Operator } from '__generated__/types';
import { useClickToCallConfigQuery, ClickToCallConfigQuery } from '../graphql/__generated__/ClickToCallConfigQuery';
import { useUpdateOperatorMutation } from '../graphql/__generated__/UpdateOperatorMutation';

type FormValues = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  country: string,
  clickToCall: Record<string, string>,
};

type Props = {
  operator: Operator,
};

type ClickToCallConfigs = ExtractApolloTypeFromArray<ClickToCallConfigQuery['clickToCall']['configs']>;

type UseOperatorPersonal = {
  deniesUpdate: boolean,
  clickToCallConfig: Array<ClickToCallConfigs>,
  handleSubmit: (values: FormValues) => void,
};

const useOperatorPersonal = (props: Props): UseOperatorPersonal => {
  const {
    operator: {
      uuid,
    },
  } = props;

  const permission = usePermission();

  const deniesUpdate = permission.denies(Config.permissions.OPERATORS.UPDATE_PROFILE);

  // ===== Requests ===== //
  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const clickToCallConfig = clickToCallConfigQuery.data?.clickToCall?.configs || [];

  const [updateOperatorMutation] = useUpdateOperatorMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      await updateOperatorMutation({ variables: { uuid, ...values } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  return {
    deniesUpdate,
    clickToCallConfig,
    handleSubmit,
  };
};

export default useOperatorPersonal;
