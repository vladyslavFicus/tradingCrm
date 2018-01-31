import { connect } from 'react-redux';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import SignIn from '../components/BrandsView';

const mapActionCreators = {
  changeDepartment: authActionCreators.changeDepartment,
  fetchAuthorities: authActionCreators.fetchAuthorities,
};
const mapStateToProps = ({ auth: { token, uuid, departmentsByBrand, fullName } }) => ({
  token,
  uuid,
  departmentsByBrand,
  fullName,
});

export default connect(mapStateToProps, mapActionCreators)(SignIn);
