import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query BranchHeader_getBranchInfo(
    $branchId: String!,
  ) {
    branchInfo (
      branchId: $branchId,
    ) {
      manager
      operator {
        fullName
      }
    }
  }
`;

const getBranchManagerQuery = ({ children, branchId }) => (
  <Query query={REQUEST} variables={{ branchId }} fetchPolicy="network-only">
    {children}
  </Query>
);

getBranchManagerQuery.propTypes = {
  children: PropTypes.func.isRequired,
  branchId: PropTypes.string.isRequired,
};

export default getBranchManagerQuery;
