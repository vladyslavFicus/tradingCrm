import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { getBackofficeBrand } from 'config';

const REQUEST = gql`
  query Brands__BrandsQuery($crmBrand: String!) {
    brandToAuthorities(crmBrand: $crmBrand) {
      id
      name
      authorities {
        id
        department
        role
      }
    }
  }
`;

const BrandsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{ crmBrand: getBackofficeBrand().id }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

BrandsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BrandsQuery;
