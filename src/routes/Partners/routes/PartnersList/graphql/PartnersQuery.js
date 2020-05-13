import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnersQuery(
    $page: PageInputType
    $searchBy: String
    $country: String
    $status: String
    $affiliateType: String
    $registrationDateFrom: String
    $registrationDateTo: String
  ) {
    partners (
      page: $page
      searchBy: $searchBy
      country: $country
      status: $status
      affiliateType: $affiliateType
      registrationDateFrom: $registrationDateFrom
      registrationDateTo: $registrationDateTo
    ) {
      data {
        page
        number
        totalElements
        size
        last
        content {
          uuid
          fullName
          createdAt
          affiliateType
          externalAffiliateId
          status
          statusChangeDate
          country
        }
      }
      error {
        error
      }
    }
  }
`;

const PartnersQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      page: {
        from: 0,
        size: 20,
        ...query && query.sorts ? { sorts: query.sorts } : { sorts: [] },
      },
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default PartnersQuery;
