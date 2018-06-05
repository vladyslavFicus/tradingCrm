import { connect } from 'react-redux';
import { compose } from 'redux';
import GameList from '../components/GameList';
import ImportGamesModal from '../components/ImportGamesModal';
import { withModals } from '../../../../../components/HighOrder';
import { actionCreators } from '../modules';

const mapStateToProps = ({ games: { games, filters, files }, i18n: { locale } }) => ({
  games,
  filters,
  files,
  locale,
});

const mapActions = {
  downloadFile: actionCreators.downloadFile,
  clearAll: actionCreators.clearAll,
  fetchGames: actionCreators.fetchGames,
  resetServerGames: actionCreators.resetServerGames,
  resetGames: actionCreators.resetGames,
  getFilterProviders: actionCreators.fetchGameProviders,
};

export default compose(
  connect(mapStateToProps, mapActions),
  withModals({
    importModal: ImportGamesModal,
  })
)(GameList);
