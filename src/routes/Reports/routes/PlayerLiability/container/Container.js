import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/player-liability';

const mapStateToProps = ({ playerLiabilityReport }) => ({
  ...playerLiabilityReport,
});
const mapActions = {
  onDownload: actionCreators.downloadReport,
  onFetch: actionCreators.fetchReport,
};

export default connect(mapStateToProps, mapActions)(View);
