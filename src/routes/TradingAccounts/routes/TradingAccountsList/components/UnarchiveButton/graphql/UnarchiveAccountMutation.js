import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import React from 'react';

const REQUEST = gql`
  mutation UnarchiveAccount(
    $uuid: String!
  ) {
    tradingAccount {
      unarchive (
        uuid: $uuid,
      )
    }
  }
`;

const UnarchiveAccountMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UnarchiveAccountMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UnarchiveAccountMutation;
