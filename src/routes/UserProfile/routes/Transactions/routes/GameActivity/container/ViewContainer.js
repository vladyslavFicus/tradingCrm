import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import config from '../../../../../../../config';

const mapStateToProps = ({
  userGamingActivity,
  userTransactionsSubTabs: { tabs: subTabRoutes },
  i18n,
}) => ({
  ...userGamingActivity,
  subTabRoutes,
  ...i18n,
  providers: config.providers,
});

export default connect(mapStateToProps, actionCreators)(View);
