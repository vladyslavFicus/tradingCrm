import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingAccountsListQuery(
    $searchKeyword: String
    $accountType: String
    $affiliateType: String
    $archived: Boolean
    $size: Int
    $page: Int
  ) {
    tradingAccountsList (
      searchKeyword: $searchKeyword
      accountType: $accountType
      affiliateType: $affiliateType
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
            affiliateType
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

const TradingAccountsListQuery = ({ children, location }) => {
  const filters = get(location, 'query.filters') || {};

  return (
    <Query
      query={REQUEST}
      fetchPolicy="cache-and-network"
      variables={{
        size: 20,
        page: 0,
        ...filters,
      }}
    >
      {children}
    </Query>
  );
};

TradingAccountsListQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default TradingAccountsListQuery;
