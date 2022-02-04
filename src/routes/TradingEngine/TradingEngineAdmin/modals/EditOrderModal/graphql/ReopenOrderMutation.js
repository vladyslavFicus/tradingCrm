import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_ReopenOrderMutation(
   $orderId: Int!
) {
  tradingEngineAdmin {
    reopenOrder(
      orderId: $orderId
    )
  }
}
`;

const ReopenOrderMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ReopenOrderMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ReopenOrderMutation;
