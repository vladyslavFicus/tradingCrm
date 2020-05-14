import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation TradingAccountChangePasswordMutation(
    $profileUUID: String!
    $password: String!
    $accountUUID: String!
  ) {
  tradingAccount {
    changePassword(profileUUID: $profileUUID, password: $password, accountUUID: $accountUUID) {
      success
    }
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
