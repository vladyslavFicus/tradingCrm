import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';

const mapStateToProps = ({ transactionsList: list }) => ({ list });
const mapActions = {
  ...actionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
