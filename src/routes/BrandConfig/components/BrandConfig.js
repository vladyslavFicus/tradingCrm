import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import BrandConfigCreate from '../routes/BrandConfigCreate';
import BrandConfigUpdate from '../routes/BrandConfigUpdate';

const BrandConfig = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/create`} component={BrandConfigCreate} />
    <Route path={`${path}/update`} component={BrandConfigUpdate} />
    <Redirect to={`${url}/update`} />
  </Switch>
);

BrandConfig.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default BrandConfig;
