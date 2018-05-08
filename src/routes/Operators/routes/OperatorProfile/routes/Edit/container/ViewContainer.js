import { connect } from 'react-redux';
import { compose } from 'redux';
import { get } from 'lodash';
import View from '../components/View';
import { actionCreators } from '../../../modules';
import { actionCreators as authoritiesActionCreators } from '../../../../../../../redux/modules/auth/authorities';
import { withNotifications } from '../../../../../../../components/HighOrder';

const mapStateToProps = ({ operatorProfile: { view, authorities }, authorities: { data: authoritiesData } }) => ({
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
)(View);
