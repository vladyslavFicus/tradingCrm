import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';

export default connect((state) => ({ list: state.usersList }), { ...actionCreators })(List);
