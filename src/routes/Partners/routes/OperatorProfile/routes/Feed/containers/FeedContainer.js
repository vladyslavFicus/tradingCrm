import { connect } from 'react-redux';
import Feed from 'routes/Operators/routes/OperatorProfile/routes/Feed/components/Feed';

const mapStateToProps = ({ operatorFeed, i18n: { locale } }) => ({
  ...operatorFeed,
  locale,
});

export default connect(mapStateToProps)(Feed);
