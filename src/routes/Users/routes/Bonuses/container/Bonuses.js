import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';
import List from '../components/List';

const mapStateToProps = (state) => ({
  list: state.userBonusesList,
  userBonus: state.userBonus,
});
const mapActions = {
  ...actionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
