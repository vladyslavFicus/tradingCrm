import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';

const mapStateToProps = state => ({
  ...state.operatorFeed,
});

export default connect(mapStateToProps, actionCreators)(View);
