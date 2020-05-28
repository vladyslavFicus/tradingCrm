import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Route from 'components/Route';
import PaymentsList from './routes/PaymentsList';

const Payments = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={PaymentsList} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Payments.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Payments;
