import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { actionCreators } from '../modules/list';

const mapStateToProps = ({ userFiles: { list: files } }) => ({
  files,
});

const mapActions = {
  fetchFilesAndNotes: actionCreators.fetchFilesAndNotes,
  changeFileStatusByAction: actionCreators.changeFileStatusByAction,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(View);
