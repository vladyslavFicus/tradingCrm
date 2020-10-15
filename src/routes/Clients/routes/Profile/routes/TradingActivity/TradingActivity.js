import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';
import './ClientTradingActivity.scss';

class TradingActivity extends PureComponent {
  render() {
    return (
      <div className="ClientTradingActivity">
        <TabHeader
          title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')}
          className="ClientTradingActivity__header"
        />
        <TradingActivityGridFilter />
        <TradingActivityGrid />
      </div>
    );
  }
}

export default TradingActivity;
