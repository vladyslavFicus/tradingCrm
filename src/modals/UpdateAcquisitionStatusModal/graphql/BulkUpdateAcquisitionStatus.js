import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation BulkUpdateAcquisitionStatus(
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

const BulkUpdateAcquisitionStatus = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

BulkUpdateAcquisitionStatus.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BulkUpdateAcquisitionStatus;
