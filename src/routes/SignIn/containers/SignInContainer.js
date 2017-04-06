import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import config from '../../../config/index';
import SignIn from '../components/SignIn';

const mapActionCreators = {
  signIn: authActionCreators.signIn,
};
const mapStateToProps = ({ auth }) => ({
  user: auth,
  departments: config.availableDepartments,
});

export default connect(mapStateToProps, mapActionCreators)(SignIn);
