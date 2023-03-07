import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import OperatorsList from './routes/OperatorsList';
import Operator from './routes/Operator';

const Operators = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={OperatorsList} />
    <Route path={`${path}/:id`} component={Operator} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(Operators);
