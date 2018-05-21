import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import FreeSpinsView from '../components/FreeSpinsView';
import config from '../../../../../../../../../config';

const mapStateToProps = ({
  userBonusFreeSpinsList: {
    list,
    filters,
    games: { games, providers },
    templates: { data: templates },
  },
  profile: { profile },
  i18n: { locale },
  options: { data: { baseCurrency } },
  userRewardsSubTabs: { tabs: subTabRoutes },
}) => ({
  filters,
  list,
  games,
  templates,
  providers,
  locale,
  currency: profile.data.currencyCode || baseCurrency,
  cancelReasons: config.modules.freeSpin.cancelReasons,
  subTabRoutes,
});
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
  exportFreeSpins: actionCreators.exportFreeSpins,
  createFreeSpin: actionCreators.createFreeSpin,
  createFreeSpinTemplate: actionCreators.createFreeSpinTemplate,
  fetchGames: actionCreators.fetchGames,
  resetAll: actionCreators.resetAll,
  manageNote: actionCreators.manageNote,
  resetNote: actionCreators.resetNote,
  fetchFilters: actionCreators.fetchFilters,
  cancelFreeSpin: actionCreators.cancelFreeSpin,
  fetchFreeSpinTemplates: actionCreators.fetchFreeSpinTemplates,
  fetchFreeSpinTemplate: actionCreators.fetchFreeSpinTemplate,
  assignFreeSpinTemplate: actionCreators.assignFreeSpinTemplate,
};

export default connect(mapStateToProps, mapActions)(FreeSpinsView);
