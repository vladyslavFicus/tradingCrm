import { graphql, compose } from 'react-apollo';
import { signInMutation, chooseDepartmentMutation } from 'graphql/mutations/auth';
import SignIn from '../components/SignIn';

export default compose(
  graphql(signInMutation, { name: 'signInMutation' }),
  graphql(chooseDepartmentMutation, { name: 'chooseDepartmentMutation' }),
)(SignIn);
