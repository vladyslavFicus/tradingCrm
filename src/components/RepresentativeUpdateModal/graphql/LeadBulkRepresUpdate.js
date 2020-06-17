import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation LeadBulkRepresUpdate(
    $salesRepresentative: [String]
    $salesStatus: String
    $allRowsSelected: Boolean
    $leads: [LeadToUpdateInputType]
    $totalElements: Int
    $searchParams: LeadsSearchParamsInputType
  ) {
    leads {
      bulkLeadUpdate(
        salesRep: $salesRepresentative
        salesStatus: $salesStatus
        allRowsSelected: $allRowsSelected
        leads: $leads
        totalElements: $totalElements
        searchParams: $searchParams
      )
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
