import { connect } from 'react-redux';
import Profile from '../components/Profile';

export default connect(({
  settings,
  auth,
}) => ({
  settings,
  auth,
}))(Profile);
