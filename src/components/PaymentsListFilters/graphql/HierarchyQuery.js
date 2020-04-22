import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query HierarchyQuery(
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
        OFFICE {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          country
          brandId
          parentBranch {
            uuid
          }
        }
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
        BRAND {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          country
          parentBranch {
            uuid
          }
          isDefault
        }
      }
    } 
  }
}`;

const HierarchyQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">{children}</Query>
);

HierarchyQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HierarchyQuery;
