import { connect } from 'react-redux';
import PlayerProfile from '../components/PlayerProfile';

export default connect(({
  settings,
  auth,
}) => ({
  settings,
  auth,
}))(PlayerProfile);

