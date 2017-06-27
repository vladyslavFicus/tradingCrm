import { connect } from 'react-redux';
import { actionCreators } from '../modules';
import List from '../components/View';

const mapStateToProps = ({ userBonusFreeSpinsList: { list } }) => ({
  list,
});
const mapActions = {
  fetchFreeSpins: actionCreators.fetchFreeSpins,
};

export default connect(mapStateToProps, mapActions)(List);
