import gql from 'graphql-tag';

const getUserBranchHierarchy = gql`query getUserBranchHierarchy(
  $userId: String!,
) {
  hierarchy {
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
  }
}`;

const getHierarchyUsersByType = gql`query getHierarchyUsersByType(
  $userTypes: [String]!,
) {
  hierarchy {
    hierarchyUsersByType (
      userTypes: $userTypes,
    ) {
      error {
        error
        fields_errors
      }
      data {
        COMPANY_ADMIN {
          uuid
          userType
          fullName
        }
        BRAND_ADMIN {
          uuid
          userType
          fullName
        }
      }
    } 
  }
}`;

const getBranchInfo = gql`query getBranchInfo(
  $branchId: String!,
) {
  hierarchy {
    branchInfo (
      branchId: $branchId,
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
        parentBranches
        deskType
        language
        defaultBranch
      }
    } 
  }
}`;

export {
  getUserBranchHierarchy,
  getHierarchyUsersByType,
  getBranchInfo,
};
