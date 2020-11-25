import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ApproveChangingLeverageMutation(
    $accountUUID: String!
  ) {
    tradingAccount {
      approveChangingLeverage(
        accountUUID: $accountUUID
      )
    }
  }
`;

const ApproveChangingLeverageMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ApproveChangingLeverageMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ApproveChangingLeverageMutation;
