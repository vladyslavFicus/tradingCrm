import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Route } from 'router';
import PartnersList from '../routes/PartnersList';
import PartnerProfile from '../routes/PartnerProfile';

const Partners = ({ match: { path, url } }) => (
  <Switch>
    <Route path={`${path}/list`} component={PartnersList} />
    <Route path={`${path}/:id`} component={PartnerProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

Partners.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Partners;
