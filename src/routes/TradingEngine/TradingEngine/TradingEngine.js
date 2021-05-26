import React, { PureComponent, Suspense } from 'react';
import { compose } from 'react-apollo';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import { tradingEngineTabs } from './constants';
import TradingEngineAccounts from '../components/TradingEngineAccounts';
import TradingEngineOrdersGrid from '../components/TradingEngineOrdersGrid';
import TradingEngineSymbols from '../components/TradingEngineSymbols';
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
              <Route path={`${path}/accounts`} component={TradingEngineAccounts} />
              <Route path={`${path}/orders`} component={TradingEngineOrdersGrid} />
              <Route path={`${path}/symbols`} component={TradingEngineSymbols} />
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
