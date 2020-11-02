import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { getBrand } from 'config';

const REQUEST = gql`
  query getBrandConfig(
    $brandId: String!
  ) {
    brandConfig(
      brandId: $brandId
    ) {
      brandId
      config
    }
  }
`;

const BrandConfigGetQuery = ({ children }) => (
  <Query query={REQUEST} variables={{ brandId: getBrand().id }} fetchPolicy="network-only">
    {children}
  </Query>
);

BrandConfigGetQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandConfigGetQuery;
