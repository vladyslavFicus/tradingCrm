import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import ClientCallbacksList from './routes/ClientCallbacksList';
import ClientCallbacksCalendar from './routes/ClientCallbacksCalendar';

const ClientCallbacks = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={ClientCallbacksList} />
      <Route path={`${path}/calendar`} component={ClientCallbacksCalendar} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(ClientCallbacks);
