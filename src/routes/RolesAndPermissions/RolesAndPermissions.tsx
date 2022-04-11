import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import Feed from './routes/RbacFeed';
import RolesAndPermissionsTab from './routes/RolesAndPermissions';

const RolesAndPermissions = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/permissions`} component={RolesAndPermissionsTab} />
    <Route path={`${path}/feed`} component={Feed} />
    <Redirect to={`${url}/permissions`} />
  </Switch>
);

export default RolesAndPermissions;
