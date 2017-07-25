import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ kycRequests: list, i18n: { locale }, ...state }) => ({
  list,
  locale,
  filterValues: getFormValues('kycRequestsGridFilter')(state) || {},
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  reset: actionCreators.reset,
};

export default connect(mapStateToProps, mapActions)(List);
