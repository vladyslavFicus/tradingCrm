import gql from 'graphql-tag';

const HierarchyBranchFragment = gql`fragment HierarchyBranchFragment on HierarchyBranch {
  uuid
  name
  branchType
  country
  defaultUser
  deskType
  language
  defaultBranch
}`;

const HierarchyUserBranchFragment = gql`fragment HierarchyUserBranchFragment on HierarchyUserBranchesTreeUp {
  uuid
  name
  brandId
  branchType
}`;

export {
  HierarchyBranchFragment,
  HierarchyUserBranchFragment,
};
