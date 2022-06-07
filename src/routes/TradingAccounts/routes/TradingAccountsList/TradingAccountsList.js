import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import TradingAccountsListFilters from './components/TradingAccountsListFilters';
import TradingAccountsListGrid from './components/TradingAccountsListGrid';
import TradingAccountsListQuery from './graphql/TradingAccountsListQuery';
import './TradingAccountsList.scss';

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
      <div className="TradingAccountsList">
        <div className="TradingAccountsList__header">
          <span>
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ACCOUNTS.HEADLINE')}
          </span>
        </div>

        <TradingAccountsListFilters
          loading={loading}
          handleRefetch={tradingAccountsData.refetch}
        />

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
