import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_ActivatePendingOrderMutation(
   $orderId: Int!
   $activationPrice: Float!
) {
  tradingEngine {
    activatePendingOrder(
      orderId: $orderId
      activationPrice: $activationPrice
    )
  }
}
`;

const ActivatePendingOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ActivatePendingOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ActivatePendingOrderMutation;
