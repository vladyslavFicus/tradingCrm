import { compose, graphql } from 'react-apollo';
import { get, set, omit } from 'lodash';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import { operatorQuery } from 'graphql/queries/operators';
import { updateOperator, addDepartment, removeDepartment } from 'graphql/mutations/operators';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { withStorage } from 'providers/StorageProvider';
import { withNotifications } from 'components/HighOrder';
import Edit from '../components/Edit';

export default compose(
  withStorage(['auth']),
  withNotifications,
  graphql(authoritiesOptionsQuery, {
    name: 'authoritiesOptions',
    props: ({ authoritiesOptions }) => {
      const departmentsRoles = get(authoritiesOptions, 'authoritiesOptions.data.post.departmentRole', {});

      return {
        departmentsRoles: omit(departmentsRoles, 'PLAYER'),
      };
    },
  }),
  graphql(updateOperator, {
    name: 'updateProfile',
  }),
  graphql(addDepartment, {
    name: 'addAuthority',
    options: ({
      match: { params: { id: uuid } },
    }) => ({
      update: (store, { data }) => {
        const storeData = store.readQuery({
          query: operatorQuery,
          variables: { uuid },
        });
        const authorities = get(data, 'operator.addDepartment.data.authorities', []);
        set(storeData, 'operator.data.authorities.data', authorities);
        store.writeQuery({ query: operatorQuery, variables: { uuid }, data: storeData });
      },
    }),
  }),
  graphql(removeDepartment, {
    name: 'deleteAuthority',
    options: ({
      match: { params: { id: uuid } },
    }) => ({
      update: (store, { data }) => {
        // TODO: need to think about cloning and updating of the store data
        const storeData = JSON.parse(JSON.stringify(store.readQuery({
          query: operatorQuery,
          variables: { uuid },
        })));
        const authorities = get(data, 'operator.removeDepartment.data.authorities', []);
        set(storeData, 'operator.data.authorities.data', authorities);
        store.writeQuery({ query: operatorQuery, variables: { uuid }, data: storeData });
      },
    }),
  }),
  graphql(getUserHierarchyById, {
    name: 'userHierarchy',
    options: ({
      match: { params: { id: userId } },
    }) => ({
      variables: { userId },
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
