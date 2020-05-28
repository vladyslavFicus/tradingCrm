import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { branchTypes } from 'constants/hierarchyTypes';
import { HierarchyBranchFragment } from 'graphql/fragments/hierarchy';

const REQUEST = gql`query BranchInfoQuery(
  $branchId: String!,
) {
  hierarchy {
    branchInfo (
      branchId: $branchId,
    ) {
      error {
        error
        fields_errors
      }
      data {
        ...HierarchyBranchFragment
        parentBranch {
          ...HierarchyBranchFragment
        }
      }
    } 
  }
}
${HierarchyBranchFragment}`;

const BranchInfoQuery = ({
  children,
  branchType,
  match: { params: { id } },
}) => (
  <Query
    query={REQUEST}
    variables={{ branchId: id }}
    skip={branchType !== branchTypes.TEAM}
  >
    {children}
  </Query>
);

BranchInfoQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  branchType: PropTypes.string.isRequired,
};

export default BranchInfoQuery;
