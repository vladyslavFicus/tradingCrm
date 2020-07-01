import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';

class TradingActivity extends PureComponent {
  render() {
    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')} />
        <TradingActivityGridFilter />
        <TradingActivityGrid />
      </Fragment>
    );
  }
}

export default TradingActivity;
