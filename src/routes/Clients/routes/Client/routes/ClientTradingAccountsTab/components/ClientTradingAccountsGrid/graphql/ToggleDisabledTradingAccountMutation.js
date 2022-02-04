import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation ToggleDisabledTradingAccountMutation(
    $accountUUID: String!
    $readOnly: Boolean!
  ) {
    tradingAccount {
      toggleDisabled(
        accountUUID: $accountUUID,
        readOnly: $readOnly,
      )
    }
  }
`;

const ToggleDisabledTradingAccountMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ToggleDisabledTradingAccountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ToggleDisabledTradingAccountMutation;
