import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const MUTATION = gql`
  mutation RepresentativeUpdateModal_BulkUpdateLeadsAcquisition(
    $uuids: [String]!
    $parentOperators: [String]
    $salesStatus: String
    $searchParams: LeadSearch__Input
    $sorts: [Sort__Input]
    $bulkSize: Int
  ) {
    hierarchy {
      bulkUpdateLeadsAcquisition(
        uuids: $uuids
        parentOperators: $parentOperators
        salesStatus: $salesStatus
        searchParams: $searchParams
        sorts: $sorts
        bulkSize: $bulkSize
      )
    }
  }
`;

const BulkUpdateLeadsAcquisitionMutations = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

BulkUpdateLeadsAcquisitionMutations.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BulkUpdateLeadsAcquisitionMutations;
