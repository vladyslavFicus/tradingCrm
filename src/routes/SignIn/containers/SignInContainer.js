import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from 'redux/modules/auth';

import SignIn from '../components/SignIn';
const mapActionCreators = {
  signIn: authActionCreators.signIn,
};
const mapStateToProps = ({ auth }) => ({
  user: auth,
});

export default connect(mapStateToProps, mapActionCreators)(SignIn);
