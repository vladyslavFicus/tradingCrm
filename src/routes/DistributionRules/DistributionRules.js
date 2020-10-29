import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import DistributionRulesList from './routes/DistributionRulesList';
import DistributionRule from './routes/DistributionRule';

const DistributionRules = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={DistributionRulesList} />
    <Route path={`${path}/:id/rule`} component={DistributionRule} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

DistributionRules.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DistributionRules;
