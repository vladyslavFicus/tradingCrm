import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_UpdateAccountGroupMutation(
   $accountUuid: String!
   $group: String
) {
  tradingEngine {
    updateAccountGroup(
      accountUuid: $accountUuid
      group: $group
    ) {
      _id
      group
    }
  }
}
`;

const UpdateAccountGroupMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAccountGroupMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAccountGroupMutation;