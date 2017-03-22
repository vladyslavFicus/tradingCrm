import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';
import config from '../../../../../config/index';

const mapStateToProps = state => ({
  ...state.userGamingActivity,
  providers: config.providers,
});

export default connect(mapStateToProps, actionCreators)(View);
