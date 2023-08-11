import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { notify, Types, useModal } from '@crm/common';
import { DistributionRule } from '__generated__/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { useDistributionRuleMigrationMutation } from '../graphql/__generated__/DistributionRuleMigrationMutation';
import {
  useDistributionRuleClientsCountQueryLazyQuery,
} from '../graphql/__generated__/DistributionRuleClientsCountQuery';

type UseDistributionRulesGrid = {
  handleRowClick: (uuid: string) => void,
  handleStartMigrationClick: (rule: DistributionRule, onRefetch: () => void) => void,
};

const useDistributionRulesGrid = (): UseDistributionRulesGrid => {
  const navigate = useNavigate();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Requests ===== //
  const [distributionRuleClientsCountQuery] = useDistributionRuleClientsCountQueryLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [distributionRuleMigrationMutation] = useDistributionRuleMigrationMutation();

  // ===== Handlers ===== //
  const handleStartMigration = useCallback(async (uuid: string, onRefetch = () => {}) => {
    try {
      await distributionRuleMigrationMutation({ variables: { uuid } });
      await onRefetch();

      confirmActionModal.hide();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_SUCCESSFUL'),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.NOTIFICATIONS.MIGRATION_ERROR'),
      });
    }
  }, []);

  const handleRowClick = (uuid: string) => {
    navigate(`/distribution/${uuid}`);
  };

  const handleStartMigrationClick = useCallback(async (rule: DistributionRule, onRefetch = () => {}) => {
    const { uuid, name, targetBrandConfigs, sourceBrandConfigs } = rule;
    const targetBrandNames = targetBrandConfigs ? targetBrandConfigs.map(({ brand }) => brand) : [];
    const sourceBrandNames = sourceBrandConfigs ? sourceBrandConfigs.map(({ brand }) => brand) : [];

    try {
      const { data } = await distributionRuleClientsCountQuery({ variables: { uuid } });
      const clientsAmount = data?.distributionClientsAmount || 0;

      confirmActionModal.show({
        onSubmit: () => handleStartMigration(uuid, onRefetch),
        modalTitle: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.TITLE'),
        actionText: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.TEXT', {
          name,
          targetBrandNames: targetBrandNames.toString(),
          sourceBrandNames: sourceBrandNames.toString(),
          clientsAmount,
        }),
        submitButtonLabel: I18n.t('CLIENTS_DISTRIBUTION.MIGRATION_MODAL.BUTTON_ACTION'),
      });
    } catch (e) {
      // Do nothing...
    }
  }, []);

  return {
    handleRowClick,
    handleStartMigrationClick,
  };
};

export default useDistributionRulesGrid;
