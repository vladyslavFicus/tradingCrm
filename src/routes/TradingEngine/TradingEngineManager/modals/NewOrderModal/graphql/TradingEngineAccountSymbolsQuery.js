import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const REQUEST = gql`
  query TradingEngine_AccountSymbolsQuery($accountUuid: String!) {
    tradingEngineAccountSymbols (
      accountUuid: $accountUuid
    ) {
      name
      description
      digits
      config(accountUuid: $accountUuid) {
        lotSize
        lotMin
        lotMax
        lotStep
        bidAdjustment
        askAdjustment
      }
    }
  }
`;

const TradingEngineAccountSymbolsQuery = ({ children, accountUuid }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ accountUuid }}
  >
    {children}
  </Query>
);

TradingEngineAccountSymbolsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  accountUuid: PropTypes.string.isRequired,
};

export default TradingEngineAccountSymbolsQuery;
