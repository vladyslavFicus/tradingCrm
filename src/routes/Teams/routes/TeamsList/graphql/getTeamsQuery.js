import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  fragment Branch on HierarchyBranch {
    uuid
    name
  }

  query TeamsList_getTeamsQuery (
    $branchType: String!,
    $keyword: String,
    $officeUuid: String,
    $deskUuid: String,
  ) {
    branch (
      branchType: $branchType,
      keyword: $keyword,
      officeUuid: $officeUuid,
      deskUuid: $deskUuid,
    ) {
      ...Branch
      parentBranch {
        ...Branch
        deskType
        parentBranch {
          ...Branch
        }
      }
    }
  }
`;

const getTeamsQuery = ({ children, location: { state = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...state?.filters,
      branchType: 'team',
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.shape({
        keyword: PropTypes.string,
        officeUuid: PropTypes.string,
        deskUuid: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default getTeamsQuery;
