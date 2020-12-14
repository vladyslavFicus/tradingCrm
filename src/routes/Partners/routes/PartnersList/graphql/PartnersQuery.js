import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnersList_PartnersQuery(
    $page: Page__Input
    $searchBy: String
    $country: String
    $status: String
    $registrationDateFrom: String
    $registrationDateTo: String
  ) {
    partners (
      page: $page
      searchBy: $searchBy
      country: $country
      status: $status
      registrationDateFrom: $registrationDateFrom
      registrationDateTo: $registrationDateTo
    ) {
      page
      number
      totalElements
      size
      last
      content {
        uuid
        fullName
        createdAt
        externalAffiliateId
        status
        statusChangeDate
        country
      }
    }
  }
`;

const PartnersQuery = ({ children, location: { state } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts?.length ? state.sorts : undefined,
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default PartnersQuery;
