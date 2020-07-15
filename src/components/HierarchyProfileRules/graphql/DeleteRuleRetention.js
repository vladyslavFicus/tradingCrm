import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation DeleteRuleRetention(
  $uuid: String!,
) {
  rule {
    deleteRuleRetention(uuid: $uuid) {
      success
    } 
  }
}`;

const DeleteRuleRetention = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DeleteRuleRetention.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DeleteRuleRetention;
