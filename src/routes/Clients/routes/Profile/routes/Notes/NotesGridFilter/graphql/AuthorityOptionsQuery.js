import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query AuthoritiesOptionsQuery_NotesGridFilter {
  authoritiesOptions
}`;

const AuthoritiesOptionsQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

AuthoritiesOptionsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthoritiesOptionsQuery;
