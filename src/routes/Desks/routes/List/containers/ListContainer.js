import { graphql, compose } from 'react-apollo';
import { withModals } from 'hoc';
import HierarchyInfoModal from 'components/HierarchyInfoModal';
import { getUserBranchHierarchy, getBranchHierarchy } from 'graphql/queries/hierarchy';
import { createDesk } from 'graphql/mutations/hierarchy';
import { branchTypes } from 'constants/hierarchyTypes';
import DeskModal from '../components/DeskModal';
import List from '../components/List';

export default compose(
  withModals({
    deskModal: DeskModal,
    infoModal: HierarchyInfoModal,
  }),
  graphql(createDesk, {
    name: 'createDesk',
  }),
  graphql(getUserBranchHierarchy, {
    name: 'userBranchHierarchy',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(getBranchHierarchy, {
    name: 'desks',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        branchType: branchTypes.DESK.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(List);
