import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { getUserHierarchyById } from 'graphql/queries/hierarchy';
import Edit from '../components/Edit';
import { actionCreators } from '../../../modules';
import { actionCreators as authoritiesActionCreators } from '../../../../../../../redux/modules/auth/authorities';
import { withNotifications } from '../../../../../../../components/HighOrder';

const mapStateToProps = ({
  auth: { uuid },
  operatorProfile: { view, authorities },
  authorities: { data: authoritiesData },
}) => ({
  auth: { uuid },
  profile: view,
  authorities,
  departmentsRoles: get(authoritiesData, 'post.departmentRole', {}),
});

const mapActions = {
  updateProfile: actionCreators.updateProfile,
  fetchAuthority: actionCreators.fetchAuthority,
  addAuthority: actionCreators.addAuthority,
  deleteAuthority: actionCreators.deleteAuthority,
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
)(Edit);

