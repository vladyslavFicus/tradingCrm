import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query OperatorHierarchyBranches_OperatorHierarchyQuery(
    $uuid: String!
  ) {
    userHierarchyById (
      uuid: $uuid
    ) {
      parentBranches {
        branchType
        uuid
        name
      }
      statistics {
        totalSubordinatesCount
      }
    }
  }
`;

const OperatorHierarchyQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: id }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

OperatorHierarchyQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default OperatorHierarchyQuery;
