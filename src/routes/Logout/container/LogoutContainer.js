import { connect } from 'react-redux';
import Logout from '../components/Logout';
import { actionCreators } from '../../../redux/modules/auth';

export default connect(null, {
  logout: actionCreators.logout,
})(Logout);
