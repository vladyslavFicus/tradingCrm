import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation createFilterSet(
  $name: String!
  $fields: String!
  $type: String!
  $favourite: Boolean!
) {
  filterSet {
    create(
      name: $name
      fields: $fields
      type: $type
      favourite: $favourite
    ) {
      name
      uuid
    }
  }
}
`;

const createFilterSetMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

createFilterSetMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default createFilterSetMutation;
