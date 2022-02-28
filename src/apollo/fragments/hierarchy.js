import { gql } from '@apollo/client';

const HierarchyBranchFragment = gql`fragment HierarchyBranchFragment on HierarchyBranch {
  uuid
  name
  branchType
  country
  defaultUser
  deskType
  language
  defaultBranch
}
`;

export {
  HierarchyBranchFragment,
};
