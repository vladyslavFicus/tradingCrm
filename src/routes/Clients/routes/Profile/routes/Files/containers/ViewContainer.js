import { connect } from 'react-redux';
import Files from '../components/Files';
import { actionCreators as filesActionCreators } from '../../../modules/files';
import { actionCreators } from '../modules/list';
import { getApiRoot } from '../../../../../../../config';

const mapStateToProps = ({ userFiles: { list: files }, i18n: { locale } }) => ({
  files,
  locale,
  filesUrl: `${getApiRoot()}/profile/files/download/`,
});

const mapActions = {
  fetchFilesAndNotes: actionCreators.fetchFilesAndNotes,
  changeFileStatusByAction: actionCreators.changeFileStatusByAction,
  downloadFile: filesActionCreators.downloadFile,
};

export default connect(mapStateToProps, mapActions)(Files);
