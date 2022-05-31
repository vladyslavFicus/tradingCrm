import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query OperatorsList_OperatorsQuery(
    $searchBy: String
    $country: String
    $status: String
    $registrationDateFrom: String
    $registrationDateTo: String
    $page: Page__Input
    $authorities: TradingEngineOperatorSearch__Authorities__Input
  ) {
    operators(
      searchBy: $searchBy
      country: $country
      status: $status
      registrationDateFrom: $registrationDateFrom
      registrationDateTo: $registrationDateTo
      page: $page
      authorities: $authorities
    ) {
      page
      number
      totalElements
      size
      last
      content {
        uuid
        fullName
        country
        registrationDate
        operatorStatus
        statusChangeDate
      }
    }
  }
`;

const defaultSorts = [
  { column: 'operatorStatus', direction: 'ASC' },
  { column: 'firstName', direction: 'ASC' },
  { column: 'lastName', direction: 'ASC' },
];

const OperatorsQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts?.length ? state.sorts : defaultSorts,
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default OperatorsQuery;
