import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import IndexRoute from '../components/IndexRoute';

const mapStateToProps = ({ auth: { logged } }) => ({ logged });

export default compose(
  withRouter,
  connect(mapStateToProps),
)(IndexRoute);
