import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query DistributionRuleBrands__BrandsQuery {
    brands {
      brandId
      brandName
    }
  }
`;

const BrandsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

BrandsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandsQuery;
