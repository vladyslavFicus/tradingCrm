import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingAccountsQuery(
    $searchKeyword: String
    $accountType: String
    $archived: Boolean
    $size: Int
    $page: Int
  ) {
    tradingAccounts (
      searchKeyword: $searchKeyword
      accountType: $accountType
      archived: $archived
      size: $size
      page: $page
    ) {
      data {
        content {
          uuid
          platformType
          profile {
            uuid
            fullName
          }
          affiliate {
            source
          }
          createdAt
          leverage
          balance
          archived
          accountType
          currency
        }
        totalElements
        size
        last
        number
      }
      error {
        error
      }
    }
  }
`;

const TradingAccountsListQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      size: 20,
      page: 0,
      ...query && query.filters,
    }}
  >
    {children}
  </Query>
);

TradingAccountsListQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default TradingAccountsListQuery;
