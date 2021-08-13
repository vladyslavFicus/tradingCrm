import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_AccountsQuery(
    $args: TradingEngineSearch__Input
  ) {
    tradingEngineAccounts (
      args: $args
    ) {
      content {
        uuid
        name
        login
        group
        credit
        profileUuid
        profileFullName
        registrationDate
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
      args: {
        ...state && state.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
        enabled: state?.filters?.enabled ? !!+state?.filters?.enabled : undefined,
      },
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
