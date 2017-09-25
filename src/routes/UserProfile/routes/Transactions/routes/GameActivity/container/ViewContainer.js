import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';
import config from '../../../../../../../config';

const mapStateToProps = state => ({
  ...state.userGamingActivity,
  ...state.i18n,
  providers: config.providers,
});

export default connect(mapStateToProps, actionCreators)(View);
