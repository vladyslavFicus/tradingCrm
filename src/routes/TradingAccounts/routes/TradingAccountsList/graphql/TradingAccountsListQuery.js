import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingAccountsQuery(
    $searchKeyword: String
    $accountType: String
    $platformType: String
    $archived: Boolean
    $page: Page__Input
  ) {
    tradingAccounts (
      searchKeyword: $searchKeyword
      platformType: $platformType
      accountType: $accountType
      archived: $archived
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
    fetchPolicy="network-only"
    variables={{
      ...state && state.filters,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
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
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default TradingAccountsListQuery;
