import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import Tree from '../routes/Tree';

const Hierarchy = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/tree`} component={Tree} />
    <Redirect to={`${url}/tree`} />
  </Switch>
);

Hierarchy.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hierarchy;
