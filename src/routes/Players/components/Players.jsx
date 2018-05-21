import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Route } from '../../../router';
import List from '../routes/List';
import Kyc from '../routes/Kyc';
import PlayerProfile from '../routes/PlayerProfile';

const Players = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/kyc-requests`} component={Kyc} />
    <Route path={`${path}/:id`} component={PlayerProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Players.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Players;
