import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

export const REQUEST = gql`
  query Hierarchy__TreeBranchQuery($uuid: String!, $brand: String) {
    treeBranch(uuid: $uuid) {
      children {
        uuid
        name
        brandId
        branchType
        manager {
          uuid
          fullName
        }
        usersCount
        childrenCount
      }
      users {
        uuid
        operator {
          fullName
          authorities(brand: $brand) {
            brand
            department
            role
          }
        }
      } 
    }
  }
`;

const TreeBranchQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

TreeBranchQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TreeBranchQuery;
