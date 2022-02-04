import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
    skip={!uuid}
  >
    {children}
  </Query>
);

TradingEngineAccountStatisticQuery.propTypes = {
  children: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default TradingEngineAccountStatisticQuery;
