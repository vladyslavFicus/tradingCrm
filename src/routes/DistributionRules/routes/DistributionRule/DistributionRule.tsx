import React, { Suspense } from 'react';
import { useParams, useRouteMatch, Switch, Redirect } from 'react-router-dom';
import { hasErrorPath } from 'apollo';
import { distributionRuleTabs } from 'config/menu';
import Route from 'components/Route';
import ShortLoader from 'components/ShortLoader';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import DistributionRuleHeader from './components/DistributionRuleHeader';
import DistributionRuleInfo from './components/DistributionRuleInfo';
import DistributionRuleGeneral from './routes/DistributionRuleGeneral';
import DistributionRuleFeeds from './routes/DistributionRuleFeeds';
import { useDistributionRuleQuery, DistributionRuleQuery } from './graphql/__generated__/DistributionRuleQuery';
import './DistributionRule.scss';

export type DistributionRuleType = DistributionRuleQuery['distributionRule'];

const DistributionRule = () => {
  const { path, url } = useRouteMatch();
  const { id: uuid } = useParams<{ id: string }>();

  const distributionRuleQuery = useDistributionRuleQuery({ variables: { uuid } });

  const distributionRule = distributionRuleQuery.data?.distributionRule;

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

          <Tabs
            className="DistributionRule__tabs"
            items={distributionRuleTabs}
          />

          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/general`} component={DistributionRuleGeneral} />
              <Route path={`${path}/feed`} component={DistributionRuleFeeds} />

              <Redirect to={`${url}/general`} />
            </Switch>
          </Suspense>
        </div>
      </Otherwise>
    </Choose>
  );
};

export default DistributionRule;