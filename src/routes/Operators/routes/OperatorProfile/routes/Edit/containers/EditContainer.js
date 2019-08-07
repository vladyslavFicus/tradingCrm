import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get, set } from 'lodash';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import { operatorQuery } from 'graphql/queries/operators';
import { updateOperator, addDepartment, removeDepartment } from 'graphql/mutations/operators';
import Edit from '../components/Edit';
import { actionCreators as authoritiesActionCreators } from '../../../../../../../redux/modules/auth/authorities';
import { withNotifications } from '../../../../../../../components/HighOrder';

const mapStateToProps = ({
  auth: { uuid, brandId },
  authorities: { data: authoritiesData },
}) => ({
  auth: { uuid },
  brandId,
  departmentsRoles: get(authoritiesData, 'post.departmentRole', {}),
});

const mapActions = {
  fetchAuthoritiesOptions: authoritiesActionCreators.fetchAuthoritiesOptions,
};

export default compose(
  withNotifications,
  connect(mapStateToProps, mapActions),
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
        const storeData = store.readQuery({
          query: operatorQuery,
          variables: { uuid },
        });
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
        authorities: authorities || {},
        profile: {
          data: {
            ...operatorProfile,
          },
        },
      };
    },
  }),
)(Edit);
