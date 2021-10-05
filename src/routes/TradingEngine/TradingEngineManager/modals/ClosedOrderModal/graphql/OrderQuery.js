import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TradingEngine_OrderQuery($orderId: Int!) {
    tradingEngineOrder (
      orderId: $orderId
    ) {
      accountLogin
      status
      group
      leverage
      id
      type
      volumeLots
      symbol
      time {
        creation
        closing
      }
      openPrice
      closePrice
      stopLoss
      takeProfit
      swaps
      pnl {
        gross
      }
      commission
      comment
    }
  }
`;

const OrderQuery = ({ children, orderId }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ orderId }}
  >
    {children}
  </Query>
);

OrderQuery.propTypes = {
  children: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired,
};

export default OrderQuery;
