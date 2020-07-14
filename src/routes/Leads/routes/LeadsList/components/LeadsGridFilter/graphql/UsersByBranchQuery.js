import gql from 'graphql-tag';

export default gql`query LeadsGridFilter__UsersByBranchQuery(
  $uuids: [String]!
) {
  usersByBranch (uuids: $uuids) {
    uuid
  }
}`;
