import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import Files from './routes/Files';
import Client from './routes/Client';
import ClientsList from './routes/ClientsList';
import ClientCallbacks from './routes/Callbacks';

const Clients = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={ClientsList} />
    <Route path={`${path}/callbacks`} component={ClientCallbacks} />
    <Route path={`${path}/kyc-documents`} component={Files} />
    <Route path={`${path}/:id`} component={Client} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Clients);
