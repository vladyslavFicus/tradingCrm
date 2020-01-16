import { graphql, compose, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { chooseDepartmentMutation } from 'graphql/mutations/authorization';
import BrandsView from '../components/BrandsView';

export default compose(
  withRouter,
  withApollo,
  graphql(chooseDepartmentMutation, { name: 'chooseDepartmentMutation' }),
)(BrandsView);
