import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_PendingOrderMutation(
   $orderId: Int!
   $activationPrice: Float!
) {
  tradingEngine {
    pendingOrder(
      orderId: $orderId
      activationPrice: $activationPrice
    )
  }
}
`;

const PendingOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

PendingOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PendingOrderMutation;
