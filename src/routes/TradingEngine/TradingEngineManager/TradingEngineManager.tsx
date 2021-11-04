import React, { Suspense } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import Route from 'components/Route';
import TradingEngineAccountsGrid from './components/TradingEngineAccountsGrid';
import TradingEngineOrdersGrid from './components/TradingEngineOrdersGrid';
import TradingEngineSymbolsGrid from './components/TradingEngineSymbolsGrid';
import TradingEngineAccountProfile from './routes/TradingEngineAccountProfile';
import './TradingEngineManager.scss';

const TradingEngineManager = (props: RouteComponentProps) => {
  const {
    match: { path, url },
  } = props;

  return (
    <RSocketProvider>
      <div className="TradingEngineManager">
        <div className="Client__tab-content">
          <Suspense fallback={null}>
            <Switch>
              <Route exact path={`${path}/accounts`} component={TradingEngineAccountsGrid} />
              <Route path={`${path}/accounts/:id`} component={TradingEngineAccountProfile} />
              <Route path={`${path}/orders`} component={TradingEngineOrdersGrid} />
              <Route path={`${path}/symbols`} component={TradingEngineSymbolsGrid} />
              <Redirect to={`${url}/accounts`} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </RSocketProvider>
  );
};

export default React.memo(TradingEngineManager);
