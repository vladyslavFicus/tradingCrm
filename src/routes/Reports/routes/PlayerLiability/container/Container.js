import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';

const mapStateToProps = ({ playerLiabilityReport }) => ({
  ...playerLiabilityReport,
});
const mapActions = {
  onReportDownload: actionCreators.downloadReport,
  onReportFetch: actionCreators.fetchReport,
  onFileDownload: actionCreators.downloadReportFile,
  onFilesFetch: actionCreators.fetchReportFiles,
};

export default connect(mapStateToProps, mapActions)(View);
