import { connect } from 'react-redux';
import Feed from '../components/Feed';
import { actionCreators } from '../modules';

const mapStateToProps = ({ operatorFeed, i18n: { locale } }) => ({
  ...operatorFeed,
  locale,
});

export default connect(mapStateToProps, actionCreators)(Feed);

