import { reduxForm } from 'redux-form';
import { get } from 'lodash';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withNotifications } from 'hoc';
import { addOperatorToBranch } from 'graphql/mutations/hierarchy';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import AddBranchForm from './AddBranchForm';
import { getBranchOption } from './utils';

const FORM_NAME = 'HierarchyOperatorProfileAddBranchForm';

export default compose(
  withRouter,
  withNotifications,
  reduxForm({
    form: FORM_NAME,
  }),
  graphql(addOperatorToBranch, {
    name: 'addOperatorToBranch',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'branchHierarchy',
    options: () => ({
      variables: { withoutBrandFilter: true },
      fetchPolicy: 'network-only',
    }),
    props: ({ branchHierarchy: { userBranches, loading } }) => {
      const TEAM = get(userBranches, 'TEAM') || [];
      const DESK = get(userBranches, 'DESK') || [];
      const OFFICE = get(userBranches, 'OFFICE') || [];
      const BRAND = get(userBranches, 'BRAND') || [];

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
)(AddBranchForm);
