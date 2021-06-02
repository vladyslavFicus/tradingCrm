import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_AccountsQuery(
    $searchKeyword: String
    $accountType: String
    $platformType: String
    $archived: Boolean
    $size: Int
    $page: Int
  ) {
    tradingEngineAccounts (
      searchKeyword: $searchKeyword
      platformType: $platformType
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
        credit
        profileUuid
        profileFullName
        createdAt
        leverage
        balance
        accountType
      }
      totalElements
      size
      last
      number
    }
  }
`;

const TradingEngineAccountsQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      ...state && state.filters,
      page: 0,
      size: 20,
      // Parse to boolean value if 'archived' value exist
      archived: state?.filters?.archived ? !!+state?.filters?.archived : undefined,
      sorts: state?.sorts?.length ? state.sorts : undefined,
    }}
  >
    {children}
  </Query>
);

TradingEngineAccountsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default TradingEngineAccountsQuery;
