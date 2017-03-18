import { connect } from 'react-redux';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { actionCreators } from '../modules';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile } }) => ({
  ...operatorProfile,
});
const mapActions = {
  onResetPassword: actionCreators.resetPassword,
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
