import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import List from '../routes/List';
import Calendar from '../routes/Calendar';

const Callbacks = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/calendar`} component={Calendar} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Callbacks.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Callbacks;
