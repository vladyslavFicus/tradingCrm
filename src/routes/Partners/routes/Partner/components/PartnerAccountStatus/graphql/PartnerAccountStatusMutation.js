import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

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
      )
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
