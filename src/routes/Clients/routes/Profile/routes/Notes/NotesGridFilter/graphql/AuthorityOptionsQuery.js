import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

const authoritiesOptionsPermission = new Permissions(permissions.AUTH.GET_AUTHORITIES);

const REQUEST = gql`query AuthoritiesOptionsQuery_NotesGridFilter {
  authoritiesOptions
}`;

const AuthoritiesOptionsQuery = ({ children, permission }) => (
  <Query query={REQUEST} skip={!authoritiesOptionsPermission.check(permission.permissions)}>
    {children}
  </Query>
);

AuthoritiesOptionsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  permission: PropTypes.shape({
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default withPermission(AuthoritiesOptionsQuery);
