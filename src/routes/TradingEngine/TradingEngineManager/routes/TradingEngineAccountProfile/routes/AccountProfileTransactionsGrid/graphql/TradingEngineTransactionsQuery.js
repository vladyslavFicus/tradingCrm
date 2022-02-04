import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query TradingEngine_TradingEngineTransactionsQuery(
  $args: TradingEngineTransactionSearch__Input
) {
  tradingEngineTransactions(args: $args) {
    content {
      id
      accountLogin
      type
      amount
      createdAt
      comment
    }
    page
    number
    totalElements
    size
    last
  }
}`;

const TradingEngineTransactionsQuery = ({
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

TradingEngineTransactionsQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default TradingEngineTransactionsQuery;
