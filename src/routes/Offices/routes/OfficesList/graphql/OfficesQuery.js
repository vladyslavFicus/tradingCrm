import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query OfficesList_OfficesQuery (
    $branchType: String!
    $keyword: String
    $country: String
  ) {
    branch (
      branchType: $branchType
      keyword: $keyword
      country: $country
    ) {
      uuid
      name
      country
    }
  }
`;

const OfficesQuery = ({ children, location: { state = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      branchType: 'office',
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OfficesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default OfficesQuery;
