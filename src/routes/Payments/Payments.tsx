import React from 'react';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';
import Route from 'components/Route';
import PaymentsList from './routes/PaymentsList';

const Payments = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`} component={PaymentsList} />
      <Redirect to={`${url}/list`} />
    </Switch>
  );
};

export default React.memo(Payments);
