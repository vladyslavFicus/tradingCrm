import { connect } from 'react-redux';
import { withApollo, compose } from 'react-apollo';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import BrandsView from '../components/BrandsView';

const mapActionCreators = {
  changeDepartment: authActionCreators.changeDepartment,
  fetchAuthorities: authActionCreators.fetchAuthorities,
};
const mapStateToProps = (state) => {
  const {
    auth: {
      token,
      uuid,
      departmentsByBrand,
      fullName,
    },
  } = state;

  return {
    token,
    uuid,
    departmentsByBrand,
    fullName,
  };
};

export default compose(
  withApollo,
  connect(mapStateToProps, mapActionCreators),
)(BrandsView);
