import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import FreeSpinsView from '../components/FreeSpinsView';
import config from '../../../../../../../config';

const mapStateToProps = (state) => {
  const {
    userBonusFreeSpinsList: { list, filters },
    profile: { profile },
  } = state;

  return {
    filters,
    list,
    currency: profile.data.currencyCode || config.nas.brand.currencies.base,
  };
};
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
  exportFreeSpins: actionCreators.exportFreeSpins,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(FreeSpinsView);
