import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import TeamsList from './routes/TeamsList';
import TeamProfile from './routes/TeamProfile';

const Teams = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={TeamsList} />
      <Route path={`${path}/:id`} component={TeamProfile} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(Teams);
