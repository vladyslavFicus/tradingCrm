import { compose } from 'redux';
import { connect } from 'react-redux';
import Accounts from '../components/Accounts';
import { withServiceCheck } from '../../../../../../../components/HighOrder';

const mapStateToProps = ({
  permissions: {
    data: currentPermissions,
  },
}) => ({
  currentPermissions,
});

export default compose(
  connect(mapStateToProps),
  withServiceCheck,
)(Accounts);
