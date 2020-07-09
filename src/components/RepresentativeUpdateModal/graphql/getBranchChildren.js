import gql from 'graphql-tag';

export default gql`query getBranchChildren(
  $uuid: String!,
) {
  branchChildren (
    uuid: $uuid,
  ) {
    uuid
    name
    branchType
    country
    defaultUser
    parentBranch {
      uuid
    }
    deskType
    language
    defaultBranch
  }
}`;
