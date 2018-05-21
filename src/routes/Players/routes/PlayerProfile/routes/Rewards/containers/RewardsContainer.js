import { connect } from 'react-redux';
import Rewards from '../components/Rewards';

const mapStateToProps = ({
  permissions: {
    data: currentPermissions,
  },
}) => ({
  currentPermissions,
});

export default connect(mapStateToProps)(Rewards);
