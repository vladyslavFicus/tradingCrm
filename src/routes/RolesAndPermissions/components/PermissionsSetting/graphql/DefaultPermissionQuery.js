import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

const REQUEST = gql`
  query PermissionSetting_DefaultPermissionQuery($department: String!, $role: String!) {
    defaultPermission(department: $department, role: $role)
  }
`;

const DefaultPermissionQuery = ({ children, department, role }) => (
  <Query
    query={REQUEST}
    variables={{ department, role }}
    skip={!department || !role}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

DefaultPermissionQuery.propTypes = {
  department: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.func.isRequired,
};

DefaultPermissionQuery.defaultProps = {
  department: null,
  role: null,
};

export default DefaultPermissionQuery;
