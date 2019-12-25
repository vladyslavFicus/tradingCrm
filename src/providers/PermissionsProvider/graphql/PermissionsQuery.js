import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query PermissionsQuery {
    permission {
      data
    }
  }
`;

const PermissionsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

PermissionsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PermissionsQuery;
