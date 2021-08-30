import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_AccountSymbolsQuery($accountUuid: String!) {
    tradingEngineAccountSymbols (
      accountUuid: $accountUuid
    ) {
      name
      description
    }
  }
`;

const AccountSymbolsQuery = ({ children, match: { params: { id: accountUuid } } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ accountUuid }}
  >
    {children}
  </Query>
);

AccountSymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default AccountSymbolsQuery;
