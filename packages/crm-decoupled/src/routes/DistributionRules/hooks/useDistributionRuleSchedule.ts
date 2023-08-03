import { useCallback } from 'react';
import I18n from 'i18n-js';
import { useParams } from 'react-router-dom';
import { parseErrors } from 'apollo';
import { DistributionRuleMutationUpdateRuleDaysOfWeekArgs } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useDistributionRuleForScheduleQuery } from '../graphql/__generated__/DistributionRuleForScheduleQuery';
import { useUpdateRuleDaysOfWeekMutation } from '../graphql/__generated__/UpdateRuleDaysOfWeekMutation';

type DaysOfWeek = Array<string>;

export type FormValues = {
  schedule: {
    days: DaysOfWeek,
  },
};

type ExecutionDaysOfWeek = DistributionRuleMutationUpdateRuleDaysOfWeekArgs['executionDaysOfWeek'];

type UseDistributionRuleSchedule = {
  scheduleBoard: ExecutionDaysOfWeek,
  handleSubmit: (formValues: FormValues) => void,
};

const useDistributionRuleSchedule = (): UseDistributionRuleSchedule => {
  const uuid = useParams().id as string;

  const { data } = useDistributionRuleForScheduleQuery({
    variables: {
      uuid,
    },
  });

  const [updateRuleDaysOfWeek] = useUpdateRuleDaysOfWeekMutation();
  const scheduleBoard = data?.distributionRule.executionDaysOfWeek || [];

  const handleSubmit = useCallback(async ({ schedule: { days } }: FormValues) => {
    try {
      await updateRuleDaysOfWeek({
        variables: {
          uuid,
          executionDaysOfWeek: days,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_TITLE'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message:
          error === 'error.entity.not.complete'
            ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.INCOMPLETE_STATUS')
            : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  }, [uuid]);

  return {
    scheduleBoard,
    handleSubmit,
  };
};

export default useDistributionRuleSchedule;
