import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import { actionCreators as bonusActionCreators } from '../../../modules/bonus';
import List from '../components/List';

const mapStateToProps = ({ userBonus: bonus, userBonusesList: list }) => ({
  list,
  bonus,
});
const mapActions = {
  ...actionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
