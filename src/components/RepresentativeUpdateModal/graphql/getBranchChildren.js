import gql from 'graphql-tag';

export default gql`query getBranchChildren(
  $uuid: String!,
) {
  hierarchy {
    branchChildren (
      uuid: $uuid,
    ) {
      error {
        error
        fields_errors
      }
      data {
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
    }
  }
}`;
