import { get } from 'lodash';
import { compose, graphql } from 'react-apollo';
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
    props: ({ branchHierarchy: { hierarchy, loading } }) => {
      const TEAM = get(hierarchy, 'userBranchHierarchy.data.TEAM') || [];
      const DESK = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
      const OFFICE = get(hierarchy, 'userBranchHierarchy.data.OFFICE') || [];
      const BRAND = get(hierarchy, 'userBranchHierarchy.data.BRAND') || [];

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
