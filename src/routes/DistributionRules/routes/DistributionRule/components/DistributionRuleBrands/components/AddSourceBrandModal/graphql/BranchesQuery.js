import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query AddSourceBrandModal__BranchesQuery {
  userBranches {
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
}`;

const BranchesQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

BranchesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BranchesQuery;
