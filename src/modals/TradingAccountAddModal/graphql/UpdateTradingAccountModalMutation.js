import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`mutation UpdateTradingAccountModalMutation_createTradingAccount(
  $name: String!
  $currency: String!
  $password: String
  $profileId: String!
  $accountType: String!
  $platformType: String!
  $amount: Float
) {
  tradingAccount {
    create(
      profileId: $profileId,
      name: $name,
      currency: $currency,
      password: $password,
      accountType: $accountType,
      platformType: $platformType,
      amount: $amount,
    )
  }
}`;

const UpdateTradingAccountModalMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

UpdateTradingAccountModalMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateTradingAccountModalMutation;
