import gql from 'graphql-tag';

export default gql`query UsersByBranchQuery(
  $uuids: [String]!,
  $onlyActive: Boolean,
) {
  hierarchy {
    usersByBranch (
      uuids: $uuids,
      onlyActive: $onlyActive,
    ) {
      error {
        error
        fields_errors
      }
      data {
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
    } 
  }
}`;
