import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

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
