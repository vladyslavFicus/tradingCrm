import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation deleteRule(
  $uuid: String!,
) {
  rules {
    deleteRule(
      uuid: $uuid,
    ) {
      error {
        error
      }
      data {
        uuid
      }
    }
  }
}
`;

const DeleteRuleMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteRuleMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteRuleMutation;
