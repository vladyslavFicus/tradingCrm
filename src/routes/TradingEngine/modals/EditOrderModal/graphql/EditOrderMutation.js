import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_EditOrderMutation(
   $orderId: String!
   $openPrice: Float
   $stopLoss: Float
   $takeProfit: Float
   $comment: String
) {
  tradingEngine {
    editOrder(
      orderId: $orderId
      openPrice: $openPrice
      stopLoss: $stopLoss
      takeProfit: $takeProfit
      comment: $comment
    )
  }
}
`;

const EditOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

EditOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EditOrderMutation;
