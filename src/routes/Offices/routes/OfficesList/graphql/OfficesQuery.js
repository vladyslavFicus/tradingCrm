import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

const OfficesQuery = ({ children, location: { query = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query.filters,
      branchType: 'office',
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

OfficesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default OfficesQuery;
