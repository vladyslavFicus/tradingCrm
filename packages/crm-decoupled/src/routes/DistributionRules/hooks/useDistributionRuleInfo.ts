import { useCallback } from 'react';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { DistributionRule__Statuses__Enum as DistributionRuleStatusesEnum } from '__generated__/types';
import { useDistributionRuleUpdateStatus } from '../graphql/__generated__/DistributionRuleUpdateStatusMutation';
import { useDistributionRuleMigrationMutation } from '../graphql/__generated__/DistributionRuleMigrationMutation';

type UseDistributionRuleInfo = {
  handleUpdateRuleStatus: (ruleStatus: DistributionRuleStatusesEnum) => void,
  handleStartMigration: () => void,
};

const useDistributionRuleInfo = (uuid: string): UseDistributionRuleInfo => {
  const [updateRuleStatus] = useDistributionRuleUpdateStatus();
  const [startMigrationRule] = useDistributionRuleMigrationMutation();

  // ===== Handlers ===== //
  const handleUpdateRuleStatus = useCallback(async (ruleStatus: DistributionRuleStatusesEnum) => {
    try {
      await updateRuleStatus({
        variables: {
          uuid,
          ruleStatus,
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
        message: error === 'error.entity.not.complete'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.INCOMPLETE_STATUS', { name: ruleStatus })
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  }, [uuid]);

  const handleStartMigration = useCallback(async () => {
    try {
      await startMigrationRule({ variables: { uuid } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_SUCCESSFUL'),
      });
    } catch (e) {
      const { error } = parseErrors(e);
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error === 'error.validation.execution.already-in-progress'
          ? I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_ALREADY_IN_PROGRESS')
          : I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_ERROR'),
      });
    }
  }, [uuid]);

  return {
    handleUpdateRuleStatus,
    handleStartMigration,
  };
};

export default useDistributionRuleInfo;
