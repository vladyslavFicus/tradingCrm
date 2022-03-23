import React, { Suspense } from 'react';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import Route from 'components/Route';
import Quotes from './routes/Quotes';
import Symbols from './routes/Symbols';
import Orders from './routes/Orders';
import Securities from './routes/Securities';
import Groups from './routes/Groups';
import Accounts from './routes/Accounts';
import Holidays from './routes/Holidays';
import Operators from './routes/Operators';
import OperatorProfile from './routes/DealingOperator';
import AccountProfile from './routes/AccountProfile';
import './TE.scss';

const TE = () => {
  const { path, url } = useRouteMatch();

  return (
    <RSocketProvider>
      <div className="TradingEngine">
        <Suspense fallback={null}>
          <Switch>
            <Route path={`${path}/orders`} component={Orders} />
            <Route path={`${path}/quotes`} component={Quotes} />
            <Route path={`${path}/symbols`} component={Symbols} />
            <Route path={`${path}/securities`} component={Securities} />
            <Route path={`${path}/accounts/:id`} component={AccountProfile} />
            <Route path={`${path}/accounts`} component={Accounts} />
            <Route path={`${path}/groups`} component={Groups} />
            <Route path={`${path}/holidays`} component={Holidays} />
            <Route path={`${path}/operators/:id`} component={OperatorProfile} />
            <Route path={`${path}/operators`} component={Operators} />
            <Redirect to={`${url}/orders`} />
          </Switch>
        </Suspense>
      </div>
    </RSocketProvider>
  );
};

export default React.memo(TE);
