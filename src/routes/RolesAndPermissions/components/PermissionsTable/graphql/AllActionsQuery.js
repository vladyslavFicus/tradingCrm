import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query RolesAndPermissions_AllActionsQuery {
    allActions
  }
`;

const ActionsQuery = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

ActionsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ActionsQuery;
