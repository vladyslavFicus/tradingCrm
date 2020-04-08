import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query UserBranchHierarchyQuery(
  $withoutBrandFilter: Boolean,
) {
  hierarchy {
    userBranchHierarchy (
      withoutBrandFilter: $withoutBrandFilter,
    ) {
      error {
        error
        fields_errors
      }
      data {
        DESK {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          deskType
          language
          brandId
          parentBranch {
            uuid
          }
          isDefault
        }
        TEAM {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          brandId
          parentBranch {
            uuid
          }
        }
      }
    } 
  }
}`;

const UserBranchHierarchyQuery = ({ children, auth: { uuid: userId } }) => (
  <Query query={REQUEST} variables={{ userId }} fetchPolicy="network-only">
    {children}
  </Query>
);

UserBranchHierarchyQuery.propTypes = {
  children: PropTypes.func.isRequired,
  auth: PropTypes.auth.isRequired,
};

export default UserBranchHierarchyQuery;
