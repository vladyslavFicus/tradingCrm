import { connect } from 'react-redux';
import View from '../components/View';
import config from '../../../../../../../config';
import { actionCreators } from '../../../modules';

const mapStateToProps = ({ operatorProfile: { view, authorities } }) => ({
  profile: view,
  authorities,
  departments: config.availableDepartments,
  roles: config.availableRoles,
});

const mapActions = {
  updateProfile: actionCreators.updateProfile,
  fetchAuthority: actionCreators.fetchAuthority,
  addAuthority: actionCreators.addAuthority,
  deleteAuthority: actionCreators.deleteAuthority,
};

export default connect(mapStateToProps, mapActions)(View);
