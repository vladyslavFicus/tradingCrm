import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from 'redux/modules/auth';
import Logout from '../components/Logout';

const mapActionCreators = {
  logout: authActionCreators.logout,
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
  uuid: state.auth.uuid,
});

export default connect(mapStateToProps, mapActionCreators)(Logout)
