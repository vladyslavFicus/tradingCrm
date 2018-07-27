import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import List from '../components/List';

const mapStateToProps = ({
  kycRequests: list,
  i18n: { locale },
  auth: { brandId, uuid },
  ...state
}) => ({
  list,
  locale,
  filterValues: getFormValues('kycRequestsGridFilter')(state) || {},
  auth: { brandId, uuid },
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
