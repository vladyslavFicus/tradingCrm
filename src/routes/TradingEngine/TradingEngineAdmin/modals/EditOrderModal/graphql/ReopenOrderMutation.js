import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_ReopenOrderMutation(
   $orderId: String!
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
