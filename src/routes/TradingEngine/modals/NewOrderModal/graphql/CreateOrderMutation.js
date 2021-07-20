import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_CreateOrderMutation(
   $accountUuid: String!
   $symbol: String!
   $volumeLots: Float!
   $type: String!
   $direction: String!
   $autoOpenPrice: Boolean!
   $openPrice: Float
   $stopLoss: Float
   $takeProfit: Float
   $comment: String
   $pendingOrder: Boolean!
) {
  tradingEngine {
    createOrder(
      accountUuid: $accountUuid
      symbol: $symbol
      volumeLots: $volumeLots
      type: $type
      direction: $direction
      autoOpenPrice: $autoOpenPrice
      openPrice: $openPrice
      stopLoss: $stopLoss
      takeProfit: $takeProfit
      comment: $comment
      pendingOrder: $pendingOrder
    )
  }
}
`;

const CreateOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CreateOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CreateOrderMutation;
