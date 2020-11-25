import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation RepresentativeUpdateModal_UpdateAcquisition(
    $uuid: String!
    $parentOperator: String
    $salesStatus: String
    $retentionStatus: String
  ) {
    hierarchy {
      updateAcquisition(
        uuid: $uuid
        parentOperator: $parentOperator
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
      )
    }
  }
`;

const UpdateAcquisitionMutations = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

UpdateAcquisitionMutations.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAcquisitionMutations;
