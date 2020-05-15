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
    tradingAccounts: PropTypes.query({
      tradingAccountsList: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingAccountsList),
      }),
    }).isRequired,
  };

  render() {
    const {
      tradingAccounts,
      tradingAccounts: { loading, data },
    } = this.props;

    const totalElements = get(data, 'tradingAccountsList.data.totalElements') || 0;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ACCOUNTS.HEADLINE')}
          </span>
        </div>
        <TradingAccountsListFilters loading={loading} />
        <TradingAccountsListGrid tradingAccounts={tradingAccounts} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    tradingAccounts: TradingAccountsListQuery,
  }),
)(TradingAccountsList);
