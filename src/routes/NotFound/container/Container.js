import { connect } from 'react-redux';
import NotFound from '../components/NotFound';

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps, {})(NotFound);

