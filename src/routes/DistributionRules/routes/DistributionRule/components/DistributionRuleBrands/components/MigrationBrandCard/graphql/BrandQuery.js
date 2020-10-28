import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query DistributionRule__BrandQuery($brandId: String!) {
    brandConfig(brandId: $brandId) {
      brandId
      brandName
    }
  }
`;

const BrandQuery = ({ children, brand }) => (
  <Query query={REQUEST} variables={{ brandId: brand }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

BrandQuery.propTypes = {
  children: PropTypes.func.isRequired,
  brand: PropTypes.string.isRequired,
};

export default BrandQuery;
