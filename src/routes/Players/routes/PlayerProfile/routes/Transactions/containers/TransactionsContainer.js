import { connect } from 'react-redux';
import Transactions from '../components/Transactions';

const mapStateToProps = ({
  permissions: {
    data: currentPermissions,
  },
}) => ({
  currentPermissions,
});


export default connect(mapStateToProps)(Transactions);

