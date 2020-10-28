import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query NotificationsGridFilter_DesksAndTeamsQuery($withoutBrandFilter: Boolean) {
    userBranches (withoutBrandFilter: $withoutBrandFilter) {
      DESK {
        name
        uuid
      }
      TEAM {
        name
        uuid
        parentBranch {
          uuid
        }
      }
    }
  }
`;

const DesksAndTeamsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    variables={{ withoutBrandFilter: true }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

DesksAndTeamsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DesksAndTeamsQuery;
