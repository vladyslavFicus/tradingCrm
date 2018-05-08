import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormSyncErrors } from 'redux-form';
import View from '../components/View';
import { actionCreators } from '../modules';
import config from '../../../../../../../config';
import { withNotifications } from '../../../../../../../components/HighOrder';

const mapStateToProps = state => ({
  userGamingActivity,
  userTransactionsSubTabs: { tabs: subTabRoutes },
  i18n,
}) => ({
  ...userGamingActivity,
  subTabRoutes,
  ...i18n,
  filterErrors: getFormSyncErrors('userGameActivityFilter')(state),
});

export default compose(
  connect(mapStateToProps, actionCreators),
  withNotifications,
)(View);
