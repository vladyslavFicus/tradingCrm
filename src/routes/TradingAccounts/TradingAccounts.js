import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import TradingAccountsList from './routes/TradingAccountsList';

const TradingAccounts = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={TradingAccountsList} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

TradingAccounts.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default TradingAccounts;
