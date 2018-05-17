import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Switch, Route } from '../../../router';
import List from '../routes/List';
import View from '../routes/View';
import Create from '../routes/Create';

const Campaigns = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/view/:id`} component={View} />
    <Route path={`${path}/create`} component={Create} />
    <Redirect from={path} to={`${url}/list`} />
  </Switch>
);

Campaigns.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Campaigns;
