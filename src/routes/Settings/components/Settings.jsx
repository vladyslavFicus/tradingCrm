import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, NotFoundRedirect } from '../../../router';
import CmsGames from '../routes/CmsGames';
import Games from '../routes/Games';
import PaymentMethods from '../routes/PaymentMethods';

const Settings = ({ match: { path } }) => (
  <Switch>
    <Route path={`${path}/cms-games`} component={CmsGames} />
    <Route path={`${path}/games`} component={Games} />
    <Route path={`${path}/paymentMethods`} component={PaymentMethods} />
    <NotFoundRedirect />
  </Switch>
);

Settings.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default Settings;
