import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation BulkUpdateClientsAcquisition(
    $uuids: [String]!
    $parentOperators: [String]
    $salesStatus: String
    $retentionStatus: String
    $searchParams: ClientSearch__Input
    $bulkSize: Int    
  ) {
    hierarchy {
      bulkUpdateClientsAcquisition(
        uuids: $uuids
        parentOperators: $parentOperators
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
        searchParams: $searchParams
        bulkSize: $bulkSize        
      )
    }
  }
`;

const BulkUpdateClientsAcquisition = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

BulkUpdateClientsAcquisition.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BulkUpdateClientsAcquisition;
