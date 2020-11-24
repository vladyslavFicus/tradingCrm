import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query Brands__BrandsQuery {
    brandToAuthorities
    brands {
      brandId
      brandName
    }
  }
`;

const BrandsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

BrandsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandsQuery;
