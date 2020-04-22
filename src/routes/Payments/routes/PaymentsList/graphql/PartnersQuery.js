import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query PartnersQuery(
  $searchBy: String,
  $country: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
) {
  partners (
    searchBy: $searchBy,
    country: $country,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
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
        status
        statusChangeDate
        country
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST}>{children}</Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
