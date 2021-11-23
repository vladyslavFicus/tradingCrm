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
   $openPrice: Float
   $stopLoss: Float
   $takeProfit: Float
   $comment: String
) {
  tradingEngine {
    createOrder(
      accountUuid: $accountUuid
      symbol: $symbol
      volumeLots: $volumeLots
      type: $type
      direction: $direction
      openPrice: $openPrice
      stopLoss: $stopLoss
      takeProfit: $takeProfit
      comment: $comment
    ) {
      id
    }
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
