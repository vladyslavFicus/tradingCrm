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

const HierarchyUserBranchFragment = gql`fragment HierarchyUserBranchFragment on UserBranchesTreeUpType {
  uuid
  name
  brandId
  branchType
}`;

export {
  HierarchyBranchFragment,
  HierarchyUserBranchFragment,
};
