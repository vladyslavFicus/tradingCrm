import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as authActionCreators } from '../../../redux/modules/auth';
import View from '../../../components/SetPassword/View';

export default connect(
  state => ({ logged: state.auth.logged, title: 'Password reset' }),
  {
    onSubmit: actionCreators.resetPasswordConfirm,
    logout: authActionCreators.logout,
  },
)(View);
