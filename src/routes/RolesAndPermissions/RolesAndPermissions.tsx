import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import FeedTab from './routes/RbacFeedTab';
import RolesAndPermissionsTab from './routes/RolesAndPermissionsTab';

const RolesAndPermissions = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/permissions`} component={RolesAndPermissionsTab} />
    <Route path={`${path}/feed`} component={FeedTab} />
    <Redirect to={`${url}/permissions`} />
  </Switch>
);

export default RolesAndPermissions;
