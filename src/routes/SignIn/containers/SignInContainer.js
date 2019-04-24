import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import { actionCreators as signInActionCreators } from '../modules/signIn';
import SignIn from '../components/SignIn';

const mapActionCreators = {
  signIn: signInActionCreators.signIn,
  selectBrand: signInActionCreators.selectBrand,
  reset: signInActionCreators.reset,
  hideBrandView: signInActionCreators.hideBrandView,
  changeDepartment: authActionCreators.changeDepartment,
  setDepartmentsByBrand: authActionCreators.setDepartmentsByBrand,
  fetchProfile: authActionCreators.fetchProfile,
  fetchAuthorities: authActionCreators.fetchAuthorities,
};

const mapStateToProps = ({ signIn }) => ({ ...signIn });

export default connect(mapStateToProps, mapActionCreators)(SignIn);
