import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ games }) => ({
  ...games,
});
const mapActions = {
  downloadFile: actionCreators.downloadFile,
  uploadFile: actionCreators.uploadFile,
  clearAll: actionCreators.clearAll,
};

export default connect(mapStateToProps, mapActions)(View);
