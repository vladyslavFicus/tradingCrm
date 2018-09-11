import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionCreators as authoritiesActionCreators } from '../../../../../../../redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from '../../../../../../../redux/modules/miniProfile';
import Notes from './Notes';

const mapActions = {
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
  fetchAuthorities: authoritiesActionCreators.fetchAuthorities,
};

export default compose(
  connect(null, mapActions),
)(Notes);
