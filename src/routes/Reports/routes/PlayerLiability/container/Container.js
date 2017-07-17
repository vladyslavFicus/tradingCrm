import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';
import config from 'config/index';

const mapStateToProps = ({ playerLiabilityReport }) => ({
  ...playerLiabilityReport,
  currency: config.nas.currencies.base,
});
const mapActions = {
  onReportDownload: actionCreators.downloadReport,
  onReportFetch: actionCreators.fetchReport,
  onFilesDownload: actionCreators.downloadReportFile,
  onFilesFetch: actionCreators.fetchReportFiles,
};

export default connect(mapStateToProps, mapActions)(View);
