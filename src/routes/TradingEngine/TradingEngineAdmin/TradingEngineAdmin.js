import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import TradingEngineSymbolsGrid from './components/TradingEngineSymbolsGrid';
import TradingEngineOrdersGrid from './components/TradingEngineOrdersGrid';
import TradingEngineSecuritiesGrid from './components/TradingEngineSecuritiesGrid';
import TradingEngineGroupsList from './components/TradingEngineGroupsList';
import TradingEngineGroupProfile from './components/TradingEngineGroupProfile';

import './TradingEngineAdmin.scss';

class TradingEngineAdmin extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  }

  render() {
    const {
      match: { path, url },
    } = this.props;

    return (
      <RSocketProvider>
        <div className="TradingEngineAdmin">
          <div className="Client__tab-content">
            <Suspense fallback={null}>
              <Switch>
                <Route path={`${path}/symbols`} component={TradingEngineSymbolsGrid} />
                <Route path={`${path}/orders`} component={TradingEngineOrdersGrid} />
                <Route path={`${path}/securities`} component={TradingEngineSecuritiesGrid} />
                <Route exact path={`${path}/groups`} component={TradingEngineGroupsList} />
                <Route path={`${path}/group/`} component={TradingEngineGroupProfile} />
                <Route path={`${path}/group/:id`} component={TradingEngineGroupProfile} />
                <Redirect to={`${url}/symbols`} />
              </Switch>
            </Suspense>
          </div>
        </div>
      </RSocketProvider>
    );
  }
}

export default TradingEngineAdmin;
