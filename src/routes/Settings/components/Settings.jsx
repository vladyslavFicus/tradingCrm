import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '../../../router';
import NotFound from '../../NotFound';
import PaymentMethods from '../routes/PaymentMethods';

const Settings = ({ match: { path } }) => (
  <Switch>
    <Route path={`${path}/paymentMethods`} component={PaymentMethods} />
    <NotFound />
  </Switch>
);

Settings.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default Settings;
