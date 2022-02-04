import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
