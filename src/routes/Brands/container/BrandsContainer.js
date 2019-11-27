import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { chooseDepartmentMutation } from 'graphql/mutations/authorization';
import BrandsView from '../components/BrandsView';

export default compose(
  withRouter,
  graphql(chooseDepartmentMutation, { name: 'chooseDepartmentMutation' }),
)(BrandsView);
