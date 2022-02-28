import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import GroupsList from './routes/GroupsList';
import NewGroup from './routes/NewGroup';
import EditGroup from './routes/EditGroup';

const Group = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={GroupsList} />
    <Route path={`${path}/new`} component={NewGroup} />
    <Route path={`${path}/:id`} component={EditGroup} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Group);
