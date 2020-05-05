import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PartnersList_getPartners(
    $page: Int
    $size: Int
    $sorts: [SortInputType]
    $searchBy: String
    $country: String
    $status: String
    $affiliateType: String
    $registrationDateFrom: String
    $registrationDateTo: String
  ) {
    partners (
      page: $page
      size: $size
      sorts: $sorts
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

const getPartnersQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      ...query && query.sorts ? { sorts: query.sorts } : {},
      size: 20,
      page: 0,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getPartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default getPartnersQuery;
