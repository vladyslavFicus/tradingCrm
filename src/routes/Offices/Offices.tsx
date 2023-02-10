import React from 'react';
import { Redirect, RouteComponentProps, Switch } from 'react-router-dom';
import Route from 'components/Route';
import OfficesList from './routes/OfficesList';
import OfficeProfile from './routes/OfficeProfile';

const Offices = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={OfficesList} />
    <Route path={`${path}/:id`} component={OfficeProfile} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Offices);
