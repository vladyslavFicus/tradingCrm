import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

const REQUEST = gql`
  query RolesAndPermissions_ActionsQuery($department: String!, $role: String!) {
    authorityActions(department: $department, role: $role)
  }
`;

const ActionsQuery = ({ children, department, role }) => (
  <Query
    query={REQUEST}
    variables={{ department, role }}
    skip={!department || !role}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

ActionsQuery.propTypes = {
  department: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.func.isRequired,
};

ActionsQuery.defaultProps = {
  department: null,
  role: null,
};

export default ActionsQuery;
