import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query AddSourceBrandModal__BranchesQuery($brandId: String) {
  userBranches(brandId: $brandId) {
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

const BranchesQuery = ({ children, initialValues: { brand } }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ brandId: brand }}
  >
    {children}
  </Query>
);

BranchesQuery.propTypes = {
  children: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default BranchesQuery;
