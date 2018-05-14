import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IndexRoute from '../components/IndexRoute';

export default withRouter(connect(({ auth: { logged } }) => ({ logged }))(IndexRoute));
