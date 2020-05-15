import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query TeamsList_getTeamsQuery (
    $branchType: String!,
    $keyword: String,
    $officeUuid: String,
    $deskUuid: String,
  ) {
    hierarchy {
      branchHierarchy (
        branchType: $branchType,
        keyword: $keyword,
        officeUuid: $officeUuid,
        deskUuid: $deskUuid,
      ) {
        data {
          office {
            uuid
            name
          }
          desk {
            uuid
            name
            deskType
          }
          team {
            uuid
            name
          }
        }
        error {
          error
        }
      }
    }
  }
`;

const getTeamsQuery = ({ children, location: { query = {} } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query.filters,
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
    query: PropTypes.shape({
      filters: PropTypes.shape({
        keyword: PropTypes.string,
        officeUuid: PropTypes.string,
        deskUuid: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default getTeamsQuery;
