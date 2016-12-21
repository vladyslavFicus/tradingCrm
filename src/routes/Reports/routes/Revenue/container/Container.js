import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { formValueSelector, getFormSyncErrors } from 'redux-form';

const valuesSelector = formValueSelector('revenueReport');
const errorSelector = getFormSyncErrors('revenueReport');
const mapStateToProps = ({ revenueReport }, ...state) => ({
  ...revenueReport,
  errors: errorSelector(state) || {},
  values: valuesSelector(state, 'startDate', 'endDate') || {},
});
const mapActions = {
  onDownload: actionCreators.downloadReport,
  onFetch: actionCreators.fetchReport,
};

export default connect(mapStateToProps, mapActions)(View);
