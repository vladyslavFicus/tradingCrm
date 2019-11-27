import { graphql, withApollo, compose } from 'react-apollo';
import { logout } from 'graphql/mutations/auth';
import Logout from '../components/Logout';

export default compose(
  withApollo,
  graphql(logout, {
    name: 'logout',
  }),
)(Logout);
