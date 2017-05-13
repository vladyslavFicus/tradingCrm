import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';
import { actionCreators as profileActionCreators } from '../../../modules/profile';
import config from '../../../../../config';
import List from '../components/View';

const mapStateToProps = ({
  profile: { bonus, profile, accumulatedBalances: { data: accumulatedBalances } },
  userBonusesList: { list },
}) => ({
  list,
  profile,
  bonus,
  accumulatedBalances,
  currencies: config.nas.currencies.supported || [],
});
const mapActions = {
  ...bonusActionCreators,
  ...actionCreators,
  fetchProfile: profileActionCreators.fetchProfile,
};

export default connect(mapStateToProps, mapActions)(List);
