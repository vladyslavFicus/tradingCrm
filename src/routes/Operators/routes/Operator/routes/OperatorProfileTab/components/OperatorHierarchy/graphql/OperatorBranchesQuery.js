import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query OperatorHierarchy_getOperatorBranchesQuery(
    $uuid: String!
  ) {
    uuid #
    userType #
    parentUsers { #
      uuid #
      userType #
    } #
    parentBranches {
      branchType
      uuid
      name
      brandId #
      parentBranch {
        uuid
      }
    }
    subordinatesCount #
  }
`;

const OperatorBranchesQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorBranchesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default OperatorBranchesQuery;
