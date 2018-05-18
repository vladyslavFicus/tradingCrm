import { connect } from 'react-redux';
import Transactions from '../components/Transactions';
import { actionCreators as subTabActionCreators } from '../../../modules/subtabs';


const mapStateToProps = ({
  userTransactionsSubTabs,
  permissions: {
    data: currentPermissions,
  },
}) => ({
  userTransactionsSubTabs,
  currentPermissions,
});

const mapActions = {
  initSubTabs: subTabActionCreators.initSubTabs,
};

export default connect(mapStateToProps, mapActions)(Transactions);

