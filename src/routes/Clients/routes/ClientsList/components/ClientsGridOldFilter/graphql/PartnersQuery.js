import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query ClientsGridOldFilter_PartnersQuery(
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
    content {
      uuid
      fullName
    }
  }
}
`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
