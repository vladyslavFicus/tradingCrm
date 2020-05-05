import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation LeadBulkRepresUpdate(
    $teamId: String
    $salesRepresentative: [String]
    $salesStatus: String
    $type: String!
    $allRowsSelected: Boolean
    $leads: [LeadBulkUpdateType]
    $totalElements: Int
    $searchParams: LeadSearchParams
  ) {
    leads {
      bulkLeadUpdate(
        teamId: $teamId
        salesRep: $salesRepresentative
        salesStatus: $salesStatus
        type: $type
        allRowsSelected: $allRowsSelected
        leads: $leads
        totalElements: $totalElements
        searchParams: $searchParams
      ) {
        data
        error {
          error
          fields_errors
        }
        errors {
          error
          fields_errors
        }
      }
    }
  }
`;

const LeadBulkRepresUpdate = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

LeadBulkRepresUpdate.propTypes = {
  children: PropTypes.func.isRequired,
};

export default LeadBulkRepresUpdate;
