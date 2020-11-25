import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`mutation updateFilterSet(
  $name: String!
  $fields: String!
  $uuid: String!
) {
  filterSet {
    update(
      name: $name
      fields: $fields
      uuid: $uuid
    )
  }
}
`;

const updateFilterSetMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

updateFilterSetMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default updateFilterSetMutation;
