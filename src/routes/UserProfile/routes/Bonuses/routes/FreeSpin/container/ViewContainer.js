import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import config from '../../../../../../../config';
import List from '../components/View';

const mapStateToProps = (state) => {
  const {
    userBonusFreeSpinsList: { list },
    profile: { profile },
  } = state;

  return {
    list,
    currency: profile.data.currencyCode || config.nas.brand.currencies.base,
  };
};
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
};

export default connect(mapStateToProps, mapActions)(List);
