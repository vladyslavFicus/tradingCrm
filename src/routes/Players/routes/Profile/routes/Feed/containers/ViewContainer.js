import { connect } from 'react-redux';
import Feed from '../components/Feed';
import { actionCreators } from '../modules';

const mapStateToProps = state => ({
  ...state.userFeed,
  ...state.i18n,
});

export default connect(mapStateToProps, actionCreators)(Feed);
