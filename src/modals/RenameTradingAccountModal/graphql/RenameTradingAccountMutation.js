import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation RenameTradingAccountModal_RenameTradingAccountMutation(
  $name: String!
  $accountUUID: String!
) {
  tradingAccount {
    rename(
      accountUUID: $accountUUID
      name: $name
    )
  }
}`;

const RenameTradingAccountMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

RenameTradingAccountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RenameTradingAccountMutation;
