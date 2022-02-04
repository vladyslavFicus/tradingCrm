import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation RejectChangingLeverageMutation(
    $accountUUID: String!
  ) {
    tradingAccount {
      rejectChangingLeverage(
        accountUUID: $accountUUID
      )
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
