import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query DistributionRule__BrandsQuery {
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
