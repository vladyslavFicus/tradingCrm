import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators } from '../modules/index';

const mapStateToProps = ({ operatorFeed, i18n: { locale } }) => ({
  ...operatorFeed,
  locale,
});

export default connect(mapStateToProps, actionCreators)(View);
