import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_AccountStatisticQuery($accountUuid: String!) {
    tradingEngineAccountStatistic (
      accountUuid: $accountUuid
    ) {
      depositsSum
      withdrawalsSum
      balance
      credit
      margin
      freeMargin
      marginLevel
      equity
      openPnl
    }
  }
`;

const TradingEngineAccountStatisticQuery = ({ children, uuid }) => (
  <Query
    query={REQUEST}
    fetchPolicy="network-only"
    variables={{ accountUuid: uuid }}
  >
    {children}
  </Query>
);

TradingEngineAccountStatisticQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default TradingEngineAccountStatisticQuery;
