import { useParams } from 'react-router-dom';
import { hasErrorPath } from '@crm/common';
import { useDistributionRuleQuery, DistributionRuleQuery } from '../graphql/__generated__/DistributionRuleQuery';

export type DistributionRuleType = DistributionRuleQuery['distributionRule'];

type UseDistributionRule = {
  loading: boolean,
  distributionRule: DistributionRuleType,
  distributionRuleError: boolean,
  showScheduleSettingsTab: boolean,
};

const useDistributionRule = (): UseDistributionRule => {
  const uuid = useParams().id as string;

  const distributionRuleQuery = useDistributionRuleQuery({ variables: { uuid } });
  const { loading } = distributionRuleQuery;

  const distributionRule = distributionRuleQuery.data?.distributionRule || {} as DistributionRuleType;

  const distributionRuleError = hasErrorPath(distributionRuleQuery.error, 'distributionRule');

  const showScheduleSettingsTab = distributionRule.executionType === 'AUTO';

  return {
    loading,
    distributionRule,
    distributionRuleError,
    showScheduleSettingsTab,
  };
};

export default useDistributionRule;
