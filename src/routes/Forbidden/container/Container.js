import { connect } from 'react-redux';
import Forbidden from '../components/Forbidden';

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps, {})(Forbidden);
