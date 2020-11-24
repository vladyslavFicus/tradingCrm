import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation deleteRule(
  $uuid: String!
) {
  rule {
    deleteRule(uuid: $uuid)
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
