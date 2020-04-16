import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query AddBranchManagerModal_getOperatorsByBranch(
    $branchUUID: String!
  ) {
    hierarchy {
      branchHierarchyTree(
        branchUUID: $branchUUID
      ) {
        data {
          users {
            uuid
            userType
            operator {
              fullName
            }
          }
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

const getBranchHierarchyTreeQuery = ({ children, branch: { uuid } }) => (
  <Query
    query={REQUEST}
    variables={{ branchUUID: uuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getBranchHierarchyTreeQuery.propTypes = {
  children: PropTypes.func.isRequired,
  branch: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default getBranchHierarchyTreeQuery;
