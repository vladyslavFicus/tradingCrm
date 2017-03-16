import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import View from '../components/View';

const mapActionCreators = {
  onSubmit: actionCreators.setNewPassword,
};
const mapStateToProps = ({ auth }) => ({
  user: auth,
});

export default connect(mapStateToProps, mapActionCreators)(View);
