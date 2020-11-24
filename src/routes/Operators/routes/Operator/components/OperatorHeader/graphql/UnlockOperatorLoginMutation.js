import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorHeader_UnlockOperatorLoginMutation(
    $uuid: String!
  ) {
    auth {
      unlockLogin(uuid: $uuid)
    }
  }
`;

const UnlockOperatorLoginMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UnlockOperatorLoginMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UnlockOperatorLoginMutation;
