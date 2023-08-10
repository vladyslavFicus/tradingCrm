import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { parseErrors, notify, LevelType } from '@crm/common';
import {
  DistributionRule__SourceBrandConfig as DistributionRuleSourceBrandConfig,
  DistributionRule__TargetBrandConfig as DistributionRuleTargetBrandConfig,
} from '__generated__/types';
import { FormValues } from 'routes/DistributionRules/types';
import {
  DistributionRuleWithSourceBrandQuery,
  useDistributionRuleWithSourceBrandQuery,
} from '../graphql/__generated__/DistributionRuleWithSourceBrandQuery';
import { useUpdateRuleMutation } from '../graphql/__generated__/UpdateRuleMutation';

type DistributionRule = DistributionRuleWithSourceBrandQuery['distributionRule'];

type UseDistributionRuleForm = {
  distributionRule?: DistributionRule,
  sourceBrandConfig?: DistributionRuleSourceBrandConfig | null,
  targetBrandConfig?: DistributionRuleTargetBrandConfig | null,
  handleSubmit: (values: FormValues) => void,
  handleCancel: () => void,
};

const useDistributionRuleForm = (): UseDistributionRuleForm => {
  const navigate = useNavigate();

  const uuid = useParams().id as string;

  // ===== Requests ===== //
  const distributionRuleQuery = useDistributionRuleWithSourceBrandQuery({ variables: { uuid } });

  const distributionRule = distributionRuleQuery.data?.distributionRule;
  const sourceBrandConfig = distributionRule?.sourceBrandConfigs && distributionRule.sourceBrandConfigs[0];
  const targetBrandConfig = distributionRule?.targetBrandConfigs && distributionRule.targetBrandConfigs[0];

  const [updateRule] = useUpdateRuleMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      await updateRule({
        variables: {
          args: {
            uuid: distributionRule?.uuid as string,
            ...values,
          },
        },
      });

      await distributionRuleQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.SUCCESS_MESSAGE'),
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_TITLE'),
        message: error === 'error.entity.already.exist'
          ? I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ALREADY_EXIST')
          : I18n.t('CLIENTS_DISTRIBUTION.RULE.UPDATE.ERROR_MESSAGE'),
      });
    }
  }, [distributionRule?.uuid]);

  const handleCancel = useCallback(() => {
    navigate('/distribution');
  }, []);

  return {
    distributionRule,
    sourceBrandConfig,
    targetBrandConfig,
    handleSubmit,
    handleCancel,
  };
};

export default useDistributionRuleForm;
