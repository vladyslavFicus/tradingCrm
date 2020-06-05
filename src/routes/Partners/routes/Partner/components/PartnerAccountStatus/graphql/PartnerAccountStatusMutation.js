import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PartnerAccountStatus_PartnerAccountStatus(
    $uuid: String!
    $reason: String!
    $status: String!
  ) {
    partner {
      changePartnerAccountStatus(
        uuid: $uuid
        reason: $reason
        status: $status
      ) {
        success
      }
    }
  }
`;

const PartnerAccountStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

PartnerAccountStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnerAccountStatusMutation;
