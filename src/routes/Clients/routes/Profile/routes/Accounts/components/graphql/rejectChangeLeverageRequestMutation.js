import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation RejectChangeLeverageRequestMutation($accountUUID: String!) {
    tradingAccount {
      rejectChangeLeverageRequest(accountUUID: $accountUUID) {
        success
      }
    }
  }
`;

const RejectChangeLeverageRequestMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

RejectChangeLeverageRequestMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RejectChangeLeverageRequestMutation;
