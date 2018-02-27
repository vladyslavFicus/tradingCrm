import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules';
import config from '../../../../../../../config';

const mapStateToProps = ({
  userGamingActivity,
  i18n,
}) => ({
  ...userGamingActivity,
  ...i18n,
  providers: config.providers,
});

export default connect(mapStateToProps, actionCreators)(View);
