import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Hierarchy__TreeTopQuery {
    treeTop {
      uuid
      name
      brandId
      branchType
      manager {
        uuid
        fullName
      }
      usersCount
      childrenCount
    }
  }
`;

const TreeTopQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

TreeTopQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TreeTopQuery;
