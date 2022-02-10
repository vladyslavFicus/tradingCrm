import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query Hierarchy__TreeTopQuery {
    treeTop {
      uuid
      name
      brandId
      branchType
      managers {
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
