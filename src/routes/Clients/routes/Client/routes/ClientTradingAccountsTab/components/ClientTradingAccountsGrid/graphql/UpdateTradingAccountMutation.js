import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation UpdateTradingAccount(
    $name: String
    $mode: String
    $currency: String
    $readOnly: Boolean
    $profileId: String!
    $accountUUID: String!
  ) {
    tradingAccount {
      update(
        profileId: $profileId,
        accountUUID: $accountUUID,
        name: $name,
        mode: $mode,
        currency: $currency,
        readOnly: $readOnly,
      )
    }
  }
`;


const UpdateTradingAccount = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

UpdateTradingAccount.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateTradingAccount;
