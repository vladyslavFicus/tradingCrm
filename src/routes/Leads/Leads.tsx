import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import LeadsList from './routes/LeadsList';
import LeadCallbacks from './routes/Callbacks';
import Lead from './routes/Lead';

const Leads = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={LeadsList} />
    <Route path={`${path}/callbacks`} component={LeadCallbacks} />
    <Route path={`${path}/:id`} component={Lead} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Leads);
