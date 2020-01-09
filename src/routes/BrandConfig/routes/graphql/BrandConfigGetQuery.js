import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query getBrandConfig(
    $brandId: String
  ) {
    brandConfig(
      brandId: $brandId
    ) {
      data
      error {
        error
        fields_errors
      }
    }
  }
`;

const BrandConfigGetQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

BrandConfigGetQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandConfigGetQuery;
