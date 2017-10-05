import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = ({ games, i18n: { locale }, filters }) => ({
  ...games,
  ...filters,
  locale,
});
const mapActions = {
  downloadFile: actionCreators.downloadFile,
  uploadFile: actionCreators.uploadFile,
  clearAll: actionCreators.clearAll,
  fetchGames: actionCreators.fetchGames,
  resetServerGames: actionCreators.resetServerGames,
  resetGames: actionCreators.resetGames,
  fetchCategories: actionCreators.fetchCategories,
};

export default connect(mapStateToProps, mapActions)(View);
