import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({
  playerLiabilityReport,
  options: { data: { baseCurrency } },
}) => ({
  ...playerLiabilityReport,
  currency: baseCurrency,
});
const mapActions = {
  onReportDownload: actionCreators.downloadReport,
  onReportFetch: actionCreators.fetchReport,
  onFilesDownload: actionCreators.downloadReportFile,
  onFilesFetch: actionCreators.fetchReportFiles,
};

export default connect(mapStateToProps, mapActions)(View);
