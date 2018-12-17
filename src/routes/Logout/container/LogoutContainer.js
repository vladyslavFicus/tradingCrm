import { connect } from 'react-redux';
import { withApollo, compose } from 'react-apollo';
import Logout from '../components/Logout';
import { actionCreators } from '../../../redux/modules/auth';

export default compose(
  withApollo,
  connect(
    ({ auth: { logged } }) => ({ logged }),
    { logout: actionCreators.logout },
  ),
)(Logout);
