import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_CloseOrderMutation(
   $orderId: Int!
   $volume: Float
   $closePrice: Float
) {
  tradingEngine {
    closeOrder(
      orderId: $orderId
      volume: $volume
      closePrice: $closePrice
    )
  }
}
`;

const CloseOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CloseOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CloseOrderMutation;
