import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Switch, Route } from '../../../router';
import List from '../routes/List';
import OperatorProfile from '../routes/OperatorProfile';

const Campaigns = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/:id/profile`} component={OperatorProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Campaigns.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Campaigns;
