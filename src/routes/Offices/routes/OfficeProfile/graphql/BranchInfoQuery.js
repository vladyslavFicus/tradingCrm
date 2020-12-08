import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { HierarchyBranchFragment } from 'graphql/fragments/hierarchy';

const REQUEST = gql`
  query BranchInfoQuery($branchId: String!) {
    branchInfo (branchId: $branchId) {
      ...HierarchyBranchFragment
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
