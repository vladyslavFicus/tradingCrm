import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import DesksList from './routes/DesksList';
import DeskProfile from './routes/DeskProfile';

const Desks = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={DesksList} />
      <Route path={`${path}/:id`} component={DeskProfile} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(Desks);
