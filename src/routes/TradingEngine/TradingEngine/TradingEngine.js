import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import TradingEngineAccountsGrid from '../components/TradingEngineAccountsGrid';
import TradingEngineOrdersGrid from '../components/TradingEngineOrdersGrid';
import TradingEngineSymbolsGrid from '../components/TradingEngineSymbolsGrid';
import TradingEngineAccountProfile from '../routes/TradingEngineAccountProfile';
import './TradingEngine.scss';

class TradingEngine extends PureComponent {
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
      <div className="TradingEngine">
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
    );
  }
}

export default TradingEngine;
