import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
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
      lotSize
      commission
      swaps
      status
      reason
      closePrice
      openRate
      closeRate
      margin
      pnl {
        gross
        net
      }
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
      symbolEntity {
        lotSize
      }
      groupSpread {
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
