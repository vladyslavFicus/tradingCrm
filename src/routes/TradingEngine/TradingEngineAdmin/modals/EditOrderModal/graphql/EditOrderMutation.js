import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation TradingEngine_EditOrderMutation(
  $args: TradingEngineEditOrderAdmin__Input
) {
  tradingEngineAdmin {
    editOrder(args: $args)
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
