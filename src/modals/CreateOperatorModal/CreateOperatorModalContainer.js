import { get } from 'lodash';
import compose from 'compose-function';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';
import { withNotifications } from 'hoc';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import { getUserBranchHierarchy } from 'graphql/queries/hierarchy';
import { createOperator } from 'graphql/mutations/operators';
import CreateOperatorModal from './CreateOperatorModal';
import { getBranchOption } from './constants';

export default compose(
  withRouter,
  withNotifications,
  graphql(createOperator, {
    name: 'submitNewOperator',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'branchHierarchy',
    options: () => ({
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
)(CreateOperatorModal);
