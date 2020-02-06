import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation MigrateButton_clientsBulkMigrationMutation(
    $allRowsSelected: Boolean
    $clients: [ClientBulkMigrateType]
    $totalElements: Int
    $searchParams: ClientSearchParams
  ) {
    clients {
      bulkMigrationUpdate(
        allRowsSelected: $allRowsSelected
        clients: $clients
        totalElements: $totalElements
        searchParams: $searchParams
      ) {
        success
        error {
          error
        }
      }
    }
  }
`;

const ClientsBulkMigrationMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ClientsBulkMigrationMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClientsBulkMigrationMutation;
