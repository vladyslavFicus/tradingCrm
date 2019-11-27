import { graphql, compose } from 'react-apollo';
import { resetPasswordMutation } from 'graphql/mutations/auth';
import ResetPassword from '../components/ResetPassword';

export default compose(
  graphql(resetPasswordMutation, {
    name: 'resetPasswordMutation',
  }),
)(ResetPassword);
