import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import PartnersList from './routes/PartnersList';
import Partner from './routes/Partner';

const Partners = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={PartnersList} />
    <Route path={`${path}/:id`} component={Partner} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Partners);
