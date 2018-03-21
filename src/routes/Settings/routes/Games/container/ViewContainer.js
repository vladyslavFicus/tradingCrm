import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = (state) => {
  const { games: { games, filters, files }, i18n: { locale } } = state;

  return {
    games,
    filters,
    files,
    locale,
  };
};
const mapActions = {
  downloadFile: actionCreators.downloadFile,
  uploadFile: actionCreators.uploadFile,
  clearAll: actionCreators.clearAll,
  fetchGames: actionCreators.fetchGames,
  resetServerGames: actionCreators.resetServerGames,
  resetGames: actionCreators.resetGames,
};

export default connect(mapStateToProps, mapActions)(View);
