import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_DeleteOrderMutation(
   $orderId: Int!
) {
  tradingEngine {
    deleteOrder(
      orderId: $orderId
    )
  }
}
`;

const DeleteOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteOrderMutation;
