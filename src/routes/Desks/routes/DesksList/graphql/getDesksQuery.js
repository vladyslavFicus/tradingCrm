import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  fragment Branch on HierarchyBranchType {
    uuid
    name
  }

  query DesksList_getDesksQuery (
    $branchType: String!
    $keyword: String
    $officeUuid: String
    $deskType: DeskTypeEnum
  ) {
    hierarchy {
      branchHierarchy (
        branchType: $branchType
        keyword: $keyword
        officeUuid: $officeUuid
        deskType: $deskType
      ) {
        data {
          ...Branch
          deskType
          parentBranch {
            ...Branch
          }
        }
      }
    }
  }
`;

const getDesksQuery = ({ children, location: { query = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query.filters,
      branchType: 'desk',
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getDesksQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default getDesksQuery;
