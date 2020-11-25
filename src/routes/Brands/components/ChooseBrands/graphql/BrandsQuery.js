import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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
