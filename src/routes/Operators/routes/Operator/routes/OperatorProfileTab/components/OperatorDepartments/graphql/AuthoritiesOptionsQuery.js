import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query OperatorDepartments_AuthoritiesOptionsQuery {
    authoritiesOptions
  }
`;

const AuthoritiesOptionsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

AuthoritiesOptionsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthoritiesOptionsQuery;
