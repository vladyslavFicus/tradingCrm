import { connect } from 'react-redux';
import NotFound from '../components/NotFound';

const mapStateToProps = ({ auth: { logged } }) => ({ logged });

export default connect(mapStateToProps)(NotFound);
