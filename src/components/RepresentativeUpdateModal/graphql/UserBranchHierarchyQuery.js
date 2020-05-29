import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query UserBranchHierarchyQuery {
    hierarchy {
      userBranchHierarchy {
        error {
          error
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
        }
      }
    }
  }
`;

const UserBranchHierarchyQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

UserBranchHierarchyQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UserBranchHierarchyQuery;
