import React, { PureComponent, Suspense } from 'react';
import { compose } from 'react-apollo';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import TradingEngineAccounts from '../components/TradingEngineAccounts';
import TradingEngineOrdersGrid from '../components/TradingEngineOrdersGrid';
import { tradingEngineTabs } from './constants';

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

        <div className="Client__tab-content">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/accounts`} component={TradingEngineAccounts} />
              <Route path={`${path}/orders`} component={TradingEngineOrdersGrid} />
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
