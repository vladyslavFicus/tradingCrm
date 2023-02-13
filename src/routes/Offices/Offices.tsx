import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import OfficesList from './routes/OfficesList';
import OfficeProfile from './routes/OfficeProfile';

const Offices = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={OfficesList} />
      <Route path={`${path}/:id`} component={OfficeProfile} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(Offices);
