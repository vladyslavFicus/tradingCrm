import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation deleteRule(
  $uuid: String!,
) {
  rule {
    deleteRule(uuid: $uuid) {
      success
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
