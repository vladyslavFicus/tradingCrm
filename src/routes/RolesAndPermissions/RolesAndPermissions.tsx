import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import RbacFeed from './routes/RbacFeed';
import RbacGrid from './routes/RbacGrid';
import './RolesAndPermissions.scss';

const RolesAndPermissions = ({ match: { path, url } }: RouteComponentProps) => (
  <div className="RolesAndPermissions">
    <Switch>
      <Route path={`${path}/permissions`} component={RbacGrid} />
      <Route path={`${path}/feed`} component={RbacFeed} />
      <Redirect to={`${url}/permissions`} />
    </Switch>
  </div>
);

export default React.memo(RolesAndPermissions);
