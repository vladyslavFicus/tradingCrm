import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import TradingAccountsListFilters from './components/TradingAccountsListFilters';
import TradingAccountsListGrid from './components/TradingAccountsListGrid';
import TradingAccountsListQuery from './graphql/TradingAccountsListQuery';

class TradingAccountsList extends PureComponent {
  static propTypes = {
    tradingAccountsData: PropTypes.query({
      tradingAccounts: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
  };

  render() {
    const {
      tradingAccountsData,
      tradingAccountsData: { loading },
    } = this.props;

    const totalElements = get(tradingAccountsData, 'data.tradingAccounts.totalElements') || 0;

    return (
      <div className="card">
        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ACCOUNTS.HEADLINE')}
          </span>
        </div>
        <TradingAccountsListFilters loading={loading} />
        <TradingAccountsListGrid tradingAccountsData={tradingAccountsData} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    tradingAccountsData: TradingAccountsListQuery,
  }),
)(TradingAccountsList);
