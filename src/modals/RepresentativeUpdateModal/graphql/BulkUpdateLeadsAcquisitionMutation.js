import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation RepresentativeUpdateModal_BulkUpdateLeadsAcquisition(
    $uuids: [String]!
    $parentOperators: [String]
    $salesStatus: String
    $searchParams: LeadSearch__Input
    $bulkSize: Int
  ) {
    hierarchy {
      bulkUpdateLeadsAcquisition(
        uuids: $uuids
        parentOperators: $parentOperators
        salesStatus: $salesStatus
        searchParams: $searchParams
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
