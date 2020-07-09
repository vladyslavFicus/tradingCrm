import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation DeleteRule(
  $uuid: String!
) {
  rule {
    deleteRule(uuid: $uuid)
  }
}`;

const DeleteRule = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteRule.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteRule;
