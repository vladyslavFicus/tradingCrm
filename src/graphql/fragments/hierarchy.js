import gql from 'graphql-tag';

const HierarchyBranchFragment = gql`fragment HierarchyBranchFragment on HierarchyBranchType {
  uuid
  name
  branchType
  country
  defaultUser
  deskType
  language
  defaultBranch
}`;

export {
  HierarchyBranchFragment,
};
