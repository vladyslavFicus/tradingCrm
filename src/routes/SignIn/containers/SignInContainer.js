import { graphql, compose } from 'react-apollo';
import { signInMutation, chooseDepartmentMutation } from 'graphql/mutations/authorization';
import SignIn from '../components/SignIn';

export default compose(
  graphql(signInMutation, { name: 'signInMutation' }),
  graphql(chooseDepartmentMutation, { name: 'chooseDepartmentMutation' }),
)(SignIn);
