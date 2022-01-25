import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const REQUEST = gql`
  query TradingEngine_AccountQuery($identifier: String!) {
    tradingEngineAccount (
      identifier: $identifier
    ) {
      _id
      uuid
      login
      currency
    }
  }
`;

const TradingEngineAccountQuery = ({ children, accountUuid }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ identifier: accountUuid }}
  >
    {children}
  </Query>
);

TradingEngineAccountQuery.propTypes = {
  children: PropTypes.func.isRequired,
  accountUuid: PropTypes.string.isRequired,
};

export default TradingEngineAccountQuery;
