import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation DeleteFilterSetMutation(
    $uuid: String!
  ) {
    filterSet {
      delete(uuid: $uuid)
    }
  }
`;

const DeleteFilterSetMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteFilterSetMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteFilterSetMutation;
