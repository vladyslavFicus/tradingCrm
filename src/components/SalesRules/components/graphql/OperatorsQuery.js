import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query OperatorsQuery(
  $searchBy: String,
  $country: String,
  $phone: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
  $page: Page__Input,
) {
  operators(
    searchBy: $searchBy,
    country: $country,
    phone: $phone,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
    page: $page,
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
          operatorStatus
        }
    }
    error {
      error
    }
  }
}`;

const OperatorsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

OperatorsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default OperatorsQuery;
