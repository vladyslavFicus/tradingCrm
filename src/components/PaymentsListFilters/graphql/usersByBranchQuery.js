import gql from 'graphql-tag';

export default gql`query usersByBranchQuery(
  $uuids: [String]!
) {
  hierarchy {
    usersByBranch (
      uuids: $uuids
    ) {
      data {
        uuid
        fullName
      }
      error {
        error
        fields_errors
      }
    } 
  }
}`;
