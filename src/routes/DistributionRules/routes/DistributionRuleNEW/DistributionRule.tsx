import React from 'react';
import { useParams } from 'react-router-dom';
import { hasErrorPath } from 'apollo';
import { distributionRuleTabs } from 'config/menu';
import ShortLoader from 'components/ShortLoader';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import DistributionRuleHeader from './components/DistributionRuleHeader';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleForm from './components/DistributionRuleForm';
import { useDistributionRuleQuery, DistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import './DistributionRule.scss';

export type DistributionRuleType = DistributionRuleQuery['distributionRule'];

const DistributionRule = () => {
  const { id: uuid } = useParams<{ id: string }>();

  const distributionRuleQuery = useDistributionRuleQuery({ variables: { uuid } });

  const distributionRule = distributionRuleQuery.data?.distributionRule as DistributionRuleType;

  const distributionRuleError = hasErrorPath(distributionRuleQuery.error, 'distributionRule');

  return (
    <Choose>
      <When condition={distributionRuleQuery.loading}>
        <ShortLoader />
      </When>
      <When condition={distributionRuleError}>
        <NotFound />
      </When>
      <Otherwise>
        <div className="DistributionRule">
          <DistributionRuleHeader distributionRule={distributionRule} />
          <DistributionRuleInfo distributionRule={distributionRule} />

          <Tabs items={distributionRuleTabs} />

          <div className="DistributionRule__content">
            <DistributionRuleForm distributionRule={distributionRule} />
          </div>
        </div>
      </Otherwise>
    </Choose>
  );
};

export default DistributionRule;
