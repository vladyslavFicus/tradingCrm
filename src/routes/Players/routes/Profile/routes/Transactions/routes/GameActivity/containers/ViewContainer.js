import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormSyncErrors } from 'redux-form';
import GameActivity from '../components/GameActivity';
import { actionCreators } from '../modules';
import { withNotifications } from '../../../../../../../../../components/HighOrder';

const mapStateToProps = state => ({
  userGamingActivity,
  i18n,
}) => ({
  ...userGamingActivity,
  ...i18n,
  filterErrors: getFormSyncErrors('userGameActivityFilter')(state),
});

export default compose(
  connect(mapStateToProps, actionCreators),
  withNotifications,
)(GameActivity);
