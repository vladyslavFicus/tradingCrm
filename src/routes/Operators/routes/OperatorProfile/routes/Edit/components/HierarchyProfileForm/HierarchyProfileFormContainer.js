import { reduxForm } from 'redux-form';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withNotifications } from 'hoc';
import { updateUser, removeOperatorFromBranch } from 'graphql/mutations/hierarchy';
import { getUserBranchesTreeUp } from 'graphql/queries/hierarchy';
import HierarchyProfileForm from './HierarchyProfileForm';

const FORM_NAME = 'HierarchyOperatorProfileForm';

export default compose(
  withRouter,
  withNotifications,
  graphql(updateUser, {
    name: 'updateOperatorHierarchy',
  }),
  graphql(removeOperatorFromBranch, {
    name: 'removeOperatorFromBranch',
  }),
  graphql(getUserBranchesTreeUp, {
    name: 'userBranchesTreeUp',
    options: ({ operatorUUID }) => ({
      variables: { userUUID: operatorUUID },
      fetchPolicy: 'network-only',
    }),
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
)(HierarchyProfileForm);
