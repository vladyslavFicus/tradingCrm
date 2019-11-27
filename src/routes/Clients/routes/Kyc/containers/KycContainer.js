import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({
  kycRequests: list,
  auth: { brandId, uuid },
  ...state
}) => ({
  list,
  filterValues: getFormValues('kycRequestsGridFilter')(state) || {},
  auth: { brandId, uuid },
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
