import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation TradingAccountChangePasswordMutation(
    $profileUUID: String!
    $password: String!
    $accountUUID: String!
  ) {
  tradingAccount {
    changePassword(
      profileUUID: $profileUUID,
      password: $password,
      accountUUID: $accountUUID
    )
  }
}`;

const TradingAccountChangePasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

TradingAccountChangePasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TradingAccountChangePasswordMutation;
