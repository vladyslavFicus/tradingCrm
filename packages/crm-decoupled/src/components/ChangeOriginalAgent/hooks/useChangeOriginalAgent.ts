import { useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { ApolloError } from '@apollo/client';
import { Config, usePermission, notify, LevelType } from '@crm/common';
import { OPERATORS_SORT } from '../constants';
import { Agent, FormValues, Operator } from '../types';
import { useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';
import { useChangeOriginalAgentMutation } from '../graphql/__generated__/ChangeOriginalAgentMutation';

type Props = {
  originalAgent: Agent,
  paymentId: string,
  onSuccess: () => void,
};

type UseChangeOriginalAgent = {
  canChangeOriginalAgent: boolean,
  handleSubmit: (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => void,
  loading: boolean,
  error?: ApolloError,
  operators: Array<Operator>,
};

const useChangeOriginalAgent = (props: Props): UseChangeOriginalAgent => {
  const { originalAgent, paymentId, onSuccess } = props;

  const permission = usePermission();

  const canChangeOriginalAgent = permission.allows(Config.permissions.PAYMENT.CHANGE_ORIGINAL_AGENT);

  // ===== Requests ===== //
  const { data, loading, error } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
    skip: !originalAgent,
  });

  const operators = useMemo(() => {
    const operatorsContent = data?.operators?.content || [];

    if (originalAgent && !operatorsContent.find(({ uuid }) => uuid === originalAgent.uuid)) {
      return [...operatorsContent, { ...originalAgent, operatorStatus: 'ACTIVE' }];
    }

    return operatorsContent;
  }, [data?.operators?.content, originalAgent]);

  const [changeOriginalAgentMutation] = useChangeOriginalAgentMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { agentId } = values;

    const newAgent = operators.find(({ uuid }) => uuid === agentId);
    const agentName = newAgent?.fullName || null;

    try {
      await changeOriginalAgentMutation({
        variables: {
          paymentId,
          agentName,
          agentId,
        },
      });

      onSuccess();
      resetForm({ values: { agentId } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }, [changeOriginalAgentMutation, onSuccess, operators, paymentId]);

  return {
    canChangeOriginalAgent,
    handleSubmit,
    loading,
    error,
    operators,
  };
};

export default useChangeOriginalAgent;
