import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query CreateOperatorModal_HierarchyUserBranchesQuery {
    userBranches {
      OFFICE {
        name
        uuid
      }
      DESK {
        name
        uuid
      }
      TEAM {
        name
        uuid
      }
      BRAND {
        name
        uuid
      }
    }
  }
`;

const HierarchyUserBranchesQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

HierarchyUserBranchesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HierarchyUserBranchesQuery;
