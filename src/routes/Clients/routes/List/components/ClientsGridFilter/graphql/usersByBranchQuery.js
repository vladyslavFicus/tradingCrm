import gql from 'graphql-tag';

export default gql`query UsersByBranchQuery(
  $uuids: [String]!,
  $onlyActive: Boolean,
) {
  usersByBranch (
    uuids: $uuids,
    onlyActive: $onlyActive,
  ) {
    uuid
    userType
    fullName
    parentUsers {
      uuid
    }
    parentBranches {
      uuid
    }
  }
}`;
