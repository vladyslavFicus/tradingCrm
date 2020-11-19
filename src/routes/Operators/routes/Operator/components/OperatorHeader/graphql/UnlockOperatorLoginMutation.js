import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
