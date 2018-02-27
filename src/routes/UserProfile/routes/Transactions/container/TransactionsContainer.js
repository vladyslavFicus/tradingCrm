import { connect } from 'react-redux';
import TransactionsLayout from '../layouts/TransactionsLayout';

const mapStateToProps = ({ userTransactionsSubTabs: { tabs: subTabRoutes } }) => ({
  subTabRoutes,
});

export default connect(mapStateToProps, {})(TransactionsLayout);

