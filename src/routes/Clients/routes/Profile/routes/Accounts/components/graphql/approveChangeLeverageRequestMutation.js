import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ApproveChangeLeverageRequestMutation($accountUUID: String!) {
    tradingAccount {
      approveChangeLeverageRequest(accountUUID: $accountUUID) {
        success
      }
    }
  }
`;

const ApproveChangeLeverageRequestMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ApproveChangeLeverageRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ApproveChangeLeverageRequestMutation;
