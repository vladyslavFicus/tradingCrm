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
      variables: { operatorUUID },
      fetchPolicy: 'network-only',
    }),
    props: ({ branchHierarchy, branchHierarchy: { loading } }) => {
      const TEAM = get(branchHierarchy, 'userBranches.TEAM') || [];
      const DESK = get(branchHierarchy, 'userBranches.DESK') || [];
      const OFFICE = get(branchHierarchy, 'userBranches.OFFICE') || [];
      const BRAND = get(branchHierarchy, 'userBranches.BRAND') || [];

      const branchTypes = [
        ...(TEAM.length ? getBranchOption(branchNames.TEAM) : []),
        ...(DESK.length ? getBranchOption(branchNames.DESK) : []),
        ...(OFFICE.length ? getBranchOption(branchNames.OFFICE) : []),
        ...(BRAND.length ? getBranchOption(branchNames.BRAND) : []),
      ];

      return {
        branchHierarchy: {
          loading,
          TEAM,
          DESK,
          OFFICE,
          BRAND,
          branchTypes,
        },
      };
    },
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
)(HierarchyProfileForm);
