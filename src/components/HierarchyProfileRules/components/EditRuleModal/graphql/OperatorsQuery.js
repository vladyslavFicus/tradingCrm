import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
    page
    number
    totalElements
    size
    last
    content {
      uuid
      fullName
      operatorStatus
      hierarchy {
        uuid
        userType
      }
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
