import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import Route from 'components/Route';
import TradingEngineGroupsList from './routes/TradingEngineGroupsList';
import TradingEngineNewGroup from './routes/TradingEngineNewGroup';
import TradingEngineEditGroup from './routes/TradingEngineEditGroup';

const TradingEngineGroup = ({ match: { path, url } }: RouteComponentProps) => (
  <Switch>
    <Route path={`${path}/list`} component={TradingEngineGroupsList} />
    <Route path={`${path}/new`} component={TradingEngineNewGroup} />
    <Route path={`${path}/:id`} component={TradingEngineEditGroup} />
    <Redirect to={`${url}/list`} />
  </Switch>
);

export default React.memo(TradingEngineGroup);
