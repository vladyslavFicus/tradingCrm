import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import { actionCreators as signInActionCreators } from '../modules/signIn';
import SignIn from '../components/SignIn';

const mapActionCreators = {
  signIn: signInActionCreators.signIn,
  selectBrand: signInActionCreators.selectBrand,
  changeDepartment: authActionCreators.changeDepartment,
};
const mapStateToProps = ({ signIn }) => ({ ...signIn });

export default connect(mapStateToProps, mapActionCreators)(SignIn);
