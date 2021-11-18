import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_UpdateAccountLeverageMutation(
   $accountUuid: String!
   $leverage: Int
) {
  tradingEngine {
    updateAccountLeverage(
      accountUuid: $accountUuid
      leverage: $leverage
    ) {
      _id
      leverage
    }
  }
}
`;

const UpdateAccountLeverageMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAccountLeverageMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAccountLeverageMutation;
