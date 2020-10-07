import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import DistributionRulesList from './routes/DistributionRulesList';

const DistributionRules = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={DistributionRulesList} />
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
