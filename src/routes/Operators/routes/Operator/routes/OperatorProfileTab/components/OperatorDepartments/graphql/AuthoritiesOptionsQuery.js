import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

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
