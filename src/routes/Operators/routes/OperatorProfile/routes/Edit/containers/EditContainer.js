import { compose, graphql } from 'react-apollo';
import { get, omit } from 'lodash';
import { withNotifications } from 'hoc';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import { operatorQuery } from 'graphql/queries/operators';
import { updateOperator, removeDepartment } from 'graphql/mutations/operators';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { withStorage } from 'providers/StorageProvider';
import Edit from '../components/Edit';

export default compose(
  withStorage(['auth']),
  withNotifications,
  graphql(authoritiesOptionsQuery, {
    name: 'authoritiesOptions',
    props: ({ authoritiesOptions }) => {
      const departmentsRoles = get(authoritiesOptions, 'authoritiesOptions.data.authoritiesOptions', {});

      return {
        departmentsRoles: omit(departmentsRoles, ['PLAYER', 'AFFILIATE']),
      };
    },
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
    props: ({ data: { operator } }) => {
      const { authorities, ...operatorProfile } = get(operator, 'data', {});
      return {
        authorities: authorities || [],
        profile: {
          data: {
            ...operatorProfile,
          },
        },
      };
    },
  }),
)(Edit);
