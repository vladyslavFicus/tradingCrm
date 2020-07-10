import gql from 'graphql-tag';

export default gql`query usersByBranchQuery(
  $uuids: [String]!
) {
  usersByBranch (
    uuids: $uuids
  ) {
    uuid
    fullName
  }
}`;
