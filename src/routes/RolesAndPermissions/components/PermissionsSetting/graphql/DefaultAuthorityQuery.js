import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

const REQUEST = gql`
  query PermissionSetting_DefaultAuthorityQuery($department: String!, $role: String!) {
    isDefaultAuthority(department: $department, role: $role)
  }
`;

const DefaultAuthorityQuery = ({ children, department, role }) => (
  <Query
    query={REQUEST}
    variables={{ department, role }}
    skip={!department || !role}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

DefaultAuthorityQuery.propTypes = {
  department: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.func.isRequired,
};

DefaultAuthorityQuery.defaultProps = {
  department: null,
  role: null,
};

export default DefaultAuthorityQuery;
