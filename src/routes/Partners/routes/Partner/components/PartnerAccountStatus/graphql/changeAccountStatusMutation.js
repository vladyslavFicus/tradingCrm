import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PartnerAccountStatus_changeAccountStatus(
    $uuid: String!
    $reason: String!
    $status: String!
  ) {
    partner {
      changeStatus(
        uuid: $uuid
        reason: $reason
        status: $status
      ) {
        success
      }
    }
  }
`;

const changeAccountStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

changeAccountStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default changeAccountStatusMutation;
