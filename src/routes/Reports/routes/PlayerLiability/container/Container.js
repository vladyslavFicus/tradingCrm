import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import config from '../../../../../config';

const mapStateToProps = ({ playerLiabilityReport }) => ({
  ...playerLiabilityReport,
  currency: config.nas.brand.currencies.base,
});
const mapActions = {
  onReportDownload: actionCreators.downloadReport,
  onReportFetch: actionCreators.fetchReport,
  onFilesDownload: actionCreators.downloadReportFile,
  onFilesFetch: actionCreators.fetchReportFiles,
};

export default connect(mapStateToProps, mapActions)(View);
