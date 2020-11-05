import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation UpdateTradingAccountModal_updateTradingAccountMutation(
  $name: String
  $profileId: String!
  $accountUUID: String!
) {
  tradingAccount {
    update(
      profileId: $profileId
      accountUUID: $accountUUID
      name: $name
    )
  }
}`;

const UpdateTradingAccount = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateTradingAccount.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateTradingAccount;
