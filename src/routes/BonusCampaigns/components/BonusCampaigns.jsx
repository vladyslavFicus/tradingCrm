import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Route } from '../../../router';
import List from '../routes/List';
import View from '../routes/View';
import Create from '../routes/Create';

const BonusCampaigns = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={List} />
    <Route path={`${path}/view/:id`} render={props => <View key={props.match.params.id} {...props} />} />
    <Route path={`${path}/create`} component={Create} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

BonusCampaigns.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default BonusCampaigns;
