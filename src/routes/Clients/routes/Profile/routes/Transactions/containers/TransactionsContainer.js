import { compose } from 'redux';
import { connect } from 'react-redux';
import Transactions from '../components/Transactions';
import { withServiceCheck } from '../../../../../../../components/HighOrder';

const mapStateToProps = ({
  permissions: {
    data: currentPermissions,
  },
}) => ({
  currentPermissions,
});


export default compose(
  withServiceCheck,
  connect(mapStateToProps)
)(Transactions);

