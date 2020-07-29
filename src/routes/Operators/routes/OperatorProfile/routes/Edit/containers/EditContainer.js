import { compose, graphql } from 'react-apollo';
import { get, omit } from 'lodash';
import { withNotifications } from 'hoc';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import { operatorQuery } from 'graphql/queries/operators';
import { updateOperator, removeDepartment } from 'graphql/mutations/operators';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import Edit from '../components/Edit';

const authoritiesOptionsPermission = new Permissions(permissions.AUTH.GET_AUTHORITIES);

export default compose(
  withStorage(['auth']),
  withNotifications,
  withPermission,
  graphql(authoritiesOptionsQuery, {
    name: 'authoritiesOptionsData',
    props: ({ authoritiesOptionsData }) => {
      const departmentsRoles = get(authoritiesOptionsData, 'authoritiesOptions', []);

      return {
        departmentsRoles: omit(departmentsRoles, ['PLAYER', 'AFFILIATE']),
      };
    },
    skip: ({ permission }) => !authoritiesOptionsPermission.check(permission.permissions),
  }),
  graphql(updateOperator, {
    name: 'updateProfile',
  }),
  graphql(removeDepartment, { name: 'deleteAuthority' }),
  graphql(getUserHierarchyById, {
    name: 'userHierarchy',
    options: ({
      match: { params: { id } },
    }) => ({
      variables: { uuid: id },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(operatorQuery, {
    options: ({ match: { params: { id } } }) => ({
      variables: { uuid: id },
    }),
    props: ({ data: { operator, refetch } }) => {
      const { authorities, ...operatorProfile } = operator || {};
      return {
        authorities,
        profile: {
          refetch,
          data: {
            ...operatorProfile,
          },
        },
      };
    },
  }),
)(Edit);
