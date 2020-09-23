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
      content {
        uuid
        name
        login
        group
        accountUUID
        platformType
        credit
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
  }
`;

const TradingAccountsListQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      ...state && state.filters,
      page: 0,
      size: 20,
      // Parse to boolean value if 'archived' value exist
      archived: state?.filters?.archived ? !!+state?.filters?.archived : undefined,
    }}
  >
    {children}
  </Query>
);

TradingAccountsListQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default TradingAccountsListQuery;
