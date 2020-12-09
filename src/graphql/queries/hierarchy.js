import gql from 'graphql-tag';
import { HierarchyBranchFragment } from '../fragments/hierarchy';

const getBranchInfo = gql`query getBranchInfo(
  $branchId: String!,
) {
  branchInfo (
    branchId: $branchId,
  ) {
    ...HierarchyBranchFragment
    parentBranch {
      ...HierarchyBranchFragment
    }
  }
}
${HierarchyBranchFragment}`;


export {
  getBranchInfo,
};
