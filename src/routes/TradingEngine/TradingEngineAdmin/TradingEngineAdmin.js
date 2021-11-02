import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import RSocketProvider from 'rsocket';
import PropTypes from 'constants/propTypes';
import Route from 'components/Route';
import TradingEngineSymbolsGrid from './components/TradingEngineSymbolsGrid';
import TradingEngineOrdersGrid from './components/TradingEngineOrdersGrid';
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
