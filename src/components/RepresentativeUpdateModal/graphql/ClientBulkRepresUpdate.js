import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation ClientBulkRepresUpdate(
    $teamId: String
    $salesRepresentative: [String]
    $retentionRepresentative: [String]
    $salesStatus: String
    $retentionStatus: String
    $type: String!
    $isMoveAction: Boolean
    $allRowsSelected: Boolean
    $clients: [ClientBulkUpdateType]
    $totalElements: Int
    $searchParams: ClientSearchParams
  ) {
    clients {
      bulkRepresentativeUpdate(
        teamId: $teamId
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
      ) {
        data
        error {
          error
          fields_errors
        }
      }
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
