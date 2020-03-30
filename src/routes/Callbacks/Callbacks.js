import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import CallbacksList from './routes/CallbacksList';
import CallbacksCalendar from './routes/CallbacksCalendar';

const Callbacks = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={CallbacksList} />
    <Route path={`${path}/calendar`} component={CallbacksCalendar} />
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
