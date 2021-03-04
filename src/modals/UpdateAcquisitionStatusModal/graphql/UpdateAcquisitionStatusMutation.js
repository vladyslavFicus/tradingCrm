import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation UpdateAcquisitionStatusModal_UpdateAcquisitionStatusMutation(
    $uuids: [String]!
    $acquisitionStatus: Desk__Types__Enum!
    $searchParams: ClientSearch__Input
    $sorts: [Sort__Input]
    $bulkSize: Int
  ) {
    hierarchy {
      bulkUpdateAcquisitionStatus(
        uuids: $uuids
        acquisitionStatus: $acquisitionStatus
        searchParams: $searchParams
        sorts: $sorts
        bulkSize: $bulkSize
      )
    }
  }
`;

const UpdateAcquisitionStatusMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

UpdateAcquisitionStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAcquisitionStatusMutation;
