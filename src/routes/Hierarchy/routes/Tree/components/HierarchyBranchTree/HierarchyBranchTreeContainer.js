import { graphql, compose } from 'react-apollo';
import { getBranchHierarchyTree } from 'graphql/queries/hierarchy';
import HierarchyBranchTree from './HierarchyBranchTree';

export default compose(
  graphql(getBranchHierarchyTree, {
    name: 'branchHierarchyTree',
    options: ({ branchUUID }) => ({
      fetchPolicy: 'network-only',
      variables: {
        branchUUID,
      },
    }),
  }),
)(HierarchyBranchTree);
