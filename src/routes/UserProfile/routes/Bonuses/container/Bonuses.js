import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';
import List from '../components/List';

const mapStateToProps = ({
  profile: { bonus, view: { profile }, accumulatedBalances: { data: accumulatedBalances }, },
  userBonusesList: { list },
}) => ({
  list,
  profile,
  bonus,
  accumulatedBalances,
});
const mapActions = {
  ...actionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
