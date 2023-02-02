import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import DesksList from './routes/DesksList';
import DeskProfile from './routes/DeskProfile';

const Desks = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={DesksList} />
    <Route path={`${path}/:id`} component={DeskProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Desks);
