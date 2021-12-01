import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_UpdateAccountReadonlyMutation(
   $accountUuid: String!
   $readOnly: Boolean
) {
  tradingEngine {
    updateAccountReadonly(
      accountUuid: $accountUuid
      readOnly: $readOnly
    ) {
      _id
      readOnly
    }
  }
}
`;

const UpdateAccountReadonlyMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAccountReadonlyMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAccountReadonlyMutation;