import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import FreeSpinsView from '../components/FreeSpinsView';

const mapStateToProps = (state) => {
  const {
    userBonusFreeSpinsList: { list, filters },
  } = state;

  return {
    filters,
    list,
  };
};
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
  exportFreeSpins: actionCreators.exportFreeSpins,
  resetAll: actionCreators.resetAll,
};

export default connect(mapStateToProps, mapActions)(FreeSpinsView);
