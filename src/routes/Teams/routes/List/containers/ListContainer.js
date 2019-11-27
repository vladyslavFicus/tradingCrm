import { graphql, compose } from 'react-apollo';
import { withModals } from 'components/HighOrder';
import HierarchyInfoModal from 'components/HierarchyInfoModal';
import { getUserBranchHierarchy, getBranchHierarchy } from 'graphql/queries/hierarchy';
import { createTeam } from 'graphql/mutations/hierarchy';
import { branchTypes } from 'constants/hierarchyTypes';
import TeamModal from '../components/TeamModal';
import List from '../components/List';

export default compose(
  withModals({
    teamModal: TeamModal,
    infoModal: HierarchyInfoModal,
  }),
  graphql(createTeam, {
    name: 'createTeam',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(getBranchHierarchy, {
    name: 'teams',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        branchType: branchTypes.TEAM.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
