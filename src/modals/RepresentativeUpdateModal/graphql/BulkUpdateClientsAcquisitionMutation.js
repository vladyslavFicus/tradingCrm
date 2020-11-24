import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation RepresentativeUpdateModal_BulkUpdateClientsAcquisition(
    $uuids: [String]!
    $parentOperators: [String]
    $salesStatus: String
    $retentionStatus: String
    $searchParams: ClientSearch__Input
    $sorts: [Sort__Input]
    $bulkSize: Int
  ) {
    hierarchy {
      bulkUpdateClientsAcquisition(
        uuids: $uuids
        parentOperators: $parentOperators
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
        searchParams: $searchParams
        sorts: $sorts
        bulkSize: $bulkSize
      )
    }
  }
`;

const BulkUpdateClientsAcquisitionMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

BulkUpdateClientsAcquisitionMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BulkUpdateClientsAcquisitionMutation;
