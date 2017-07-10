import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import { getFormValues, getFormSubmitErrors } from 'redux-form';
import config from 'config/index';

const valuesSelector = getFormValues('revenueReport');
const errorSelector = getFormSubmitErrors('revenueReport');
const mapStateToProps = ({ revenueReport, ...state }) => ({
  form: {
    errors: errorSelector(state) || {},
    values: valuesSelector(state, 'startDate', 'endDate') || {},
  },
  ...revenueReport,
  currency: config.nas.currencies.base,
});
const mapActions = {
  onDownload: actionCreators.downloadReport,
  onFetch: actionCreators.fetchReport,
};

export default connect(mapStateToProps, mapActions)(View);
