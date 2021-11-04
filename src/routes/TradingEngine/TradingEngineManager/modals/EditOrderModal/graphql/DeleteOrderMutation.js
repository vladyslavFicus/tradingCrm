import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
