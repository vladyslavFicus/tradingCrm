/* eslint-disable */

import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import NotFound from 'routes/NotFound';
import TradingEngineSymbolsGrid from './components/TradingEngineSymbolsGrid';
import './TradingEngineAdmin.scss';

class TradingEngineAdmin extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  }

  render() {
    const {
      match: { path, url },
      permission,
    } = this.props;

    return (
      <Choose>
        <When condition={permission.allows(permissions.TRADING_ENGINE.GET_ACCOUNTS)}>
          <RSocketProvider>
            <div className="TradingEngineAdmin">
              <div className="Client__tab-content">
                <Suspense fallback={null}>
                  <Switch>
                    <Route path={`${path}/symbols`} component={TradingEngineSymbolsGrid} />
                    <Redirect to={`${url}/symbols`} />
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
  }
}

export default withPermission(TradingEngineAdmin);
