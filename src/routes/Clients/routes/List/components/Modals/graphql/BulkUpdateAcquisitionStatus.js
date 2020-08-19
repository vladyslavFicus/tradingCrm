import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation BulkUpdateAcquisitionStatus(
    $uuids: [String]!
    $acquisitionStatus: String!
    $searchParams: ClientSearch__Input
    $bulkSize: Int
  ) {
    hierarchy {
      bulkUpdateAcquisitionStatus(
        uuids: $uuids
        acquisitionStatus: $salesStatus
        searchParams: $searchParams
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
