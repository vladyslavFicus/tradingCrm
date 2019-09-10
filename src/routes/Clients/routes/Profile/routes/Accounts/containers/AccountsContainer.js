import { connect } from 'react-redux';
import Accounts from '../components/Accounts';

const mapStateToProps = ({
  permissions: {
    data: currentPermissions,
  },
}) => ({
  currentPermissions,
});

export default connect(mapStateToProps)(Accounts);
