import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingEngine_TradingEngineHistoryQuery(
  $args: TradingEngineHistorySearch__Input
) {
  tradingEngineHistory(args: $args) {
    content {
      id
      accountLogin
      type
      closingTime
      openingTime
      symbol
      volume
      closePrice
      profit
      deletedAt
      openPrice
      stopLoss
      takeProfit
      swaps
      status
    }
    page
    number
    totalElements
    size
    last
  }
}`;

const TradingEngineHistoryQuery = ({
  children,
  location: { state },
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        accountUuid: id,
        ...state && state.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

TradingEngineHistoryQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default TradingEngineHistoryQuery;
