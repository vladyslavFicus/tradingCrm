import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get, set } from 'lodash';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import { partnerQuery } from 'graphql/queries/partners';
import { updatePartner } from 'graphql/mutations/partners';
import { addDepartment, removeDepartment } from 'graphql/mutations/operators';
import { actionCreators as authoritiesActionCreators } from 'redux/modules/auth/authorities';
import { withNotifications } from 'components/HighOrder';
import Edit from 'routes/Operators/routes/OperatorProfile/routes/Edit/components/Edit';
import { operatorTypes } from 'constants/operators';

const mapStateToProps = ({
  auth: { uuid, brandId },
  authorities: { data: authoritiesData },
  i18n: { locale },
}) => ({
  auth: { uuid },
  brandId,
  locale,
  departmentsRoles: get(authoritiesData, 'post.departmentRole', {}),
  operatorType: operatorTypes.PARTNER,
});

const mapActions = {
  fetchAuthoritiesOptions: authoritiesActionCreators.fetchAuthoritiesOptions,
};

export default compose(
  withNotifications,
  connect(mapStateToProps, mapActions),
  graphql(getUserHierarchyById, {
    name: 'userHierarchy',
    options: ({
      match: { params: { id: userId } },
    }) => ({
      variables: { userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(updatePartner, {
    name: 'updateProfile',
  }),
  graphql(addDepartment, {
    name: 'addAuthority',
    options: ({
      match: { params: { id: uuid } },
    }) => ({
      update: (store, { data }) => {
        const storeData = store.readQuery({
          query: partnerQuery,
          variables: { uuid },
        });
        const authorities = get(data, 'operator.addDepartment.data.authorities', []);
        set(storeData, 'partner.data.authorities.data', authorities);
        store.writeQuery({ query: partnerQuery, variables: { uuid }, data: storeData });
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
          query: partnerQuery,
          variables: { uuid },
        });
        const authorities = get(data, 'operator.removeDepartment.data.authorities', []);
        set(storeData, 'partner.data.authorities.data', authorities);
        store.writeQuery({ query: partnerQuery, variables: { uuid }, data: storeData });
      },
    }),
  }),
  graphql(partnerQuery, {
    options: ({ match: { params: { id } } }) => ({
      variables: { uuid: id },
    }),
    props: ({ data: { partner } }) => {
      const { authorities, forexOperator, ...partnerProfile } = get(partner, 'data', {});
      return {
        authorities: authorities || {},
        allowedIpAddresses: get(forexOperator, 'data.permission.allowedIpAddresses') || [],
        forbiddenCountries: get(forexOperator, 'data.permission.forbiddenCountries') || [],
        showNotes: get(forexOperator, 'data.permission.showNotes') || false,
        showSalesStatus: get(forexOperator, 'data.permission.showSalesStatus') || false,
        profile: {
          data: {
            ...partnerProfile,
          },
        },
      };
    },
  }),
)(Edit);

