import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation ClientContactsForm_UpdateClientEmailMutation(
    $playerUUID: String!
    $email: String
  ) {
    profile {
      updateEmail(
        playerUUID: $playerUUID
        email: $email
      ) {
        _id
        contacts {
          email
        }
      }
    }
  }
`;

const UpdateClientEmailMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

UpdateClientEmailMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateClientEmailMutation;
