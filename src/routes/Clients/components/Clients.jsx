import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Route } from '../../../router';
import List from '../routes/List';
import Kyc from '../routes/Kyc';
import Files from '../routes/Files';
import Profile from '../routes/Profile';

const Clients = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/kyc-requests`} component={Kyc} />
    <Route path={`${path}/kyc-documents`} component={Files} />
    <Route path={`${path}/:id`} component={Profile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Clients.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Clients;
