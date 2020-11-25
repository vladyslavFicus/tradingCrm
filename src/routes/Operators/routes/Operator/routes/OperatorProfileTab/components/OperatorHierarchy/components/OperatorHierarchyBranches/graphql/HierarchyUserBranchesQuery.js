import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query OperatorHierarchyBranches_HierarchyUserBranchesQuery($withoutBrandFilter: Boolean) {
    userBranches (withoutBrandFilter: $withoutBrandFilter) {
      OFFICE {
        name
        uuid
        branchType
        parentBranch {
          uuid
          name
          branchType
        }
      }
      DESK {
        name
        uuid
        branchType
        parentBranch {
          uuid
          name
          branchType
        }
      }
      TEAM {
        name
        uuid
        branchType
        parentBranch {
          uuid
          name
          branchType
        }
      }
      BRAND {
        name
        uuid
        branchType
      }
    }
  }
`;

const HierarchyUserBranchesQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{ withoutBrandFilter: true }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

HierarchyUserBranchesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HierarchyUserBranchesQuery;
