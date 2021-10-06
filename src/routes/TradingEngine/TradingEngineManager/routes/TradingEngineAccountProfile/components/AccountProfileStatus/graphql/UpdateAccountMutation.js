import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation TradingEngine_UpdateAccountMutation(
   $accountUuid: String!
   $readOnly: Boolean
) {
  tradingEngine {
    updateAccount(
      accountUuid: $accountUuid
      readOnly: $readOnly
    ) {
      _id
      readOnly
    }
  }
}
`;

const UpdateAccountMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateAccountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAccountMutation;
