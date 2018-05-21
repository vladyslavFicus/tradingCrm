import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';

const mapStateToProps = state => ({
  ...state.userFeed,
  ...state.i18n,
});

export default connect(mapStateToProps, actionCreators)(View);
