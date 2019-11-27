import { graphql, compose } from 'react-apollo';
import { chooseDepartmentMutation } from 'graphql/mutations/authorization';
import HeaderDepartments from './HeaderDepartments';

export default compose(
  graphql(chooseDepartmentMutation, { name: 'chooseDepartmentMutation' }),
)(HeaderDepartments);
