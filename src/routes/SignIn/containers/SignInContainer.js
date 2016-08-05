import { connect } from 'react-redux';
import { actionCreators as signInActionCreators } from '../modules/sign-in';
import SignIn from '../components/SignIn';

const mapActionCreators = {
  login: signInActionCreators.login,
};
const mapStateToProps = (state) => ({
  isSuccess: state.signIn.isSuccess,
  isOnRequest: state.signIn.isOnRequest,
  isFailure: state.signIn.isFailure,
  failureMessage: state.signIn.failureMessage,
});

export default connect(mapStateToProps, mapActionCreators)(SignIn)
