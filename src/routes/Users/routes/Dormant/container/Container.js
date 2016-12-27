import { connect } from 'react-redux';
import { actionCreators } from '../modules/list';
import List from '../components/List';

export default connect(
  ({ dormantUserList: list }) => ({ list }),
  { ...actionCreators }
)(List);
