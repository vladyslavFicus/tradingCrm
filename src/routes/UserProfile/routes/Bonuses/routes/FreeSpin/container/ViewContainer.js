import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import FreeSpinsView from '../components/FreeSpinsView';
import config from '../../../../../../../config';

const mapStateToProps = (state) => {
  const {
    userBonusFreeSpinsList: { list, filters, games: { games, providers } },
    profile: { profile },
  } = state;

  return {
    filters,
    list,
    games,
    providers,
    currency: profile.data.currencyCode || config.nas.currencies.base,
    cancelReasons: config.modules.freeSpin.cancelReasons,
  };
};
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
  exportFreeSpins: actionCreators.exportFreeSpins,
  createFreeSpin: actionCreators.createFreeSpin,
  fetchGames: actionCreators.fetchGames,
  resetAll: actionCreators.resetAll,
  manageNote: actionCreators.manageNote,
  resetNote: actionCreators.resetNote,
  fetchFilters: actionCreators.fetchFilters,
  cancelFreeSpin: actionCreators.cancelFreeSpin,
};

export default connect(mapStateToProps, mapActions)(FreeSpinsView);
