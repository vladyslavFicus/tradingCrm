import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation BulkUpdateLeadsAcquisition(
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

const BulkUpdateLeadsAcquisition = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

BulkUpdateLeadsAcquisition.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BulkUpdateLeadsAcquisition;
