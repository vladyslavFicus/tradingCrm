import React, { PureComponent, Suspense } from 'react';
import { compose } from 'react-apollo';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import TradingEngineAccountsGrid from '../components/TradingEngineAccountsGrid';
import TradingEngineOrdersGrid from '../components/TradingEngineOrdersGrid';
import TradingEngineSymbolsGrid from '../components/TradingEngineSymbolsGrid';
import { tradingEngineTabs } from './constants';
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
        <Tabs items={tradingEngineTabs} />
        <div>
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/accounts`} component={TradingEngineAccountsGrid} />
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

export default compose(
  withRouter,
)(TradingEngine);
