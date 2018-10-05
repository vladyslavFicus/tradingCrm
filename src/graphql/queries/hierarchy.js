import gql from 'graphql-tag';

const getUserBranchHierarchy = gql`query getUserBranchHierarchy(
  $userId: String!,
) {
  userBranchHierarchy (
    userId: $userId,
  ) {
    error {
      error
      fields_errors
    }
    data {
      OFFICE {
        name
        uuid
        branchType
        defaultUser
        defaultBranch
        country
        parentBranches
      }
      DESK {
        name
        uuid
        branchType
        defaultUser
        defaultBranch
        deskType
        language
        parentBranches
      }
    }
  } 
}`;

export {
  getUserBranchHierarchy,
};
