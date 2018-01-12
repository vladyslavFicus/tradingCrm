import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import FreeSpinsView from '../components/FreeSpinsView';
import config from '../../../../../../../config';

const mapStateToProps = (state) => {
  const {
    userBonusFreeSpinsList: {
      list,
      filters,
      games: { games, providers },
      templates: { data: templates },
    },
    profile: { profile },
    i18n: { locale },
  } = state;

  return {
    filters,
    list,
    games,
    templates,
    providers,
    locale,
    currency: profile.data.currencyCode || config.nas.brand.currencies.base,
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
  fetchFreeSpinTemplates: actionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: actionCreators.fetchFreeSpinTemplate,
};

export default connect(mapStateToProps, mapActions)(FreeSpinsView);
