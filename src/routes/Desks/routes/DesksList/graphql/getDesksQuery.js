import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  fragment Branch on HierarchyBranch {
    uuid
    name
  }

  query DesksList_getDesksQuery (
    $branchType: String!
    $keyword: String
    $officeUuid: String
    $deskType: Desk__Types__Enum
  ) {
    branch (
      branchType: $branchType
      keyword: $keyword
      officeUuid: $officeUuid
      deskType: $deskType
    ) {
      ...Branch
      deskType
      parentBranch {
        ...Branch
      }
    }
  }
`;

const getDesksQuery = ({ children, location: { state = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      branchType: 'desk',
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

getDesksQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default getDesksQuery;
