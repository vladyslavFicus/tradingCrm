import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import DistributionRulesList from './routes/DistributionRulesList';
import DistributionRule from './routes/DistributionRule';

const DistributionRules = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={DistributionRulesList} />
    <Route path={`${path}/:id/rule`} component={DistributionRule} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(DistributionRules);
