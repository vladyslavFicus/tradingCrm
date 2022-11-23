import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import LeadCallbacksList from './routes/LeadCallbacksList';
import LeadCallbacksCalendar from './routes/LeadCallbacksCalendar';

const LeadCallbacks = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={LeadCallbacksList} />
      <Route path={`${path}/calendar`} component={LeadCallbacksCalendar} />
      <Redirect to={`${path}/list`} />
    </Switch>
  );
};

export default React.memo(LeadCallbacks);
