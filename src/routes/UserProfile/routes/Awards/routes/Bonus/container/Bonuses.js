import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as profileActionCreators } from '../../../../../modules/profile';
import List from '../components/View';

const mapStateToProps = ({
  profile: { profile, accumulatedBalances: { data: accumulatedBalances } },
  userBonusesList: { list, bonus },
}) => ({
  list,
  profile,
  bonus,
  accumulatedBalances,
});
const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  createBonus: actionCreators.createBonus,
  acceptBonus: actionCreators.acceptBonus,
  cancelBonus: actionCreators.cancelBonus,
  fetchActiveBonus: actionCreators.fetchActiveBonus,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
