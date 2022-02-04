import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { HierarchyBranchFragment } from 'apollo/fragments/hierarchy';

const REQUEST = gql`
  query BranchInfoQuery($branchId: String!) {
    branchInfo (branchId: $branchId) {
      ...HierarchyBranchFragment
      parentBranch {
        ...HierarchyBranchFragment
      }
    }
  }
${HierarchyBranchFragment}`;

const BranchInfoQuery = ({ children, match: { params: { id } } }) => (
  <Query query={REQUEST} variables={{ branchId: id }}>
    {children}
  </Query>
);

BranchInfoQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default BranchInfoQuery;
