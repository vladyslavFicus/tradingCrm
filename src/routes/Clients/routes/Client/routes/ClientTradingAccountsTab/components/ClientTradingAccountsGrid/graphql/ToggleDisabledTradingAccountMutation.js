import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
