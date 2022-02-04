import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

export const REQUEST = gql`
  query TradingEngine_OrderQuery($orderId: Int!) {
    tradingEngineOrder (
      orderId: $orderId
    ) {
      id
      accountLogin
      accountUuid
      tradeType
      symbol
      symbolAlias
      direction
      digits
      takeProfit
      stopLoss
      openPrice
      closePrice
      marginRate
      volumeUnits
      volumeLots
      commission
      swaps
      status
      time {
        creation
        modification
        expiration
        closing
      }
      comment
      type
      account {
        currency
      }
      symbolConfig {
        lotSize
        lotStep
        bidAdjustment
        askAdjustment
      }
    }
  }
`;

const OrderQuery = ({ children, id }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ orderId: id }}
  >
    {children}
  </Query>
);

OrderQuery.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default OrderQuery;
