import React, { Suspense } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import { Permission } from 'types/permissions';
import Route from 'components/Route';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import NotFound from 'routes/NotFound';
import TradingEngineAccountsGrid from './components/TradingEngineAccountsGrid';
import TradingEngineOrdersGrid from './components/TradingEngineOrdersGrid';
import TradingEngineSymbolsGrid from './components/TradingEngineSymbolsGrid';
import TradingEngineAccountProfile from './routes/TradingEngineAccountProfile';
import './TradingEngineManager.scss';

const TradingEngineManager = (props: RouteComponentProps) => {
  const {
    match: { path, url },
  } = props;

  const permission: Permission = usePermission();

  return (
    <Choose>
      <When condition={permission.allows(permissions.TRADING_ENGINE.GET_ACCOUNTS)}>
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
      </When>
      <Otherwise>
        <NotFound />
      </Otherwise>
    </Choose>
  );
};

export default React.memo(TradingEngineManager);
