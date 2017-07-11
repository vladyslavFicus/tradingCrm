import { connect } from 'react-redux';
import { actionCreators as signInActionCreators } from '../modules/signIn';
import SignIn from '../components/SignIn';

const mapActionCreators = {
  signIn: signInActionCreators.signIn,
  selectBrand: signInActionCreators.selectBrand,
  selectDepartment: signInActionCreators.selectDepartment,
};
const mapStateToProps = ({ signIn }) => ({ ...signIn });

export default connect(mapStateToProps, mapActionCreators)(SignIn);
