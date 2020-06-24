import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ClientBulkRepresUpdate(
    $salesRepresentative: [String]
    $retentionRepresentative: [String]
    $salesStatus: String
    $retentionStatus: String
    $type: String!
    $isMoveAction: Boolean
    $allRowsSelected: Boolean
    $clients: [ClientToUpdateInput]
    $totalElements: Int
    $searchParams: ClientSearchParams
  ) {
    profile {
      bulkClientUpdate(
        salesRepresentative: $salesRepresentative
        retentionRepresentative: $retentionRepresentative
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
        type: $type
        isMoveAction: $isMoveAction
        allRowsSelected: $allRowsSelected
        clients: $clients
        totalElements: $totalElements
        searchParams: $searchParams
      )
    }
  }
`;

const ClientBulkRepresUpdate = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

ClientBulkRepresUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientBulkRepresUpdate;
