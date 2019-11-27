import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import IndexRoute from '../components/IndexRoute';

export default compose(
  withRouter,
)(IndexRoute);
