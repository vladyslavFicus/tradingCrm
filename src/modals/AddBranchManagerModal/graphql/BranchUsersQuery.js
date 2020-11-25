import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query AddBranchManagerModal_BranchUsersQuery($branchUuid: String!) {
    branchUsers(branchUuid: $branchUuid) {
      uuid
      operator {
        fullName
        operatorStatus
      }
    }
  }
`;

const BranchUsersQuery = ({ children, branch: { uuid } }) => (
  <Query
    query={REQUEST}
    variables={{ branchUuid: uuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

BranchUsersQuery.propTypes = {
  children: PropTypes.func.isRequired,
  branch: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default BranchUsersQuery;
