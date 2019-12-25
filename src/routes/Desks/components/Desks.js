import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import List from '../routes/List';
import DeskProfile from '../routes/DeskProfile';

const Desks = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/:id`} component={DeskProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Desks.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Desks;
