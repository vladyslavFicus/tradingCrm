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
          isDefault
        }
        TEAM {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
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
        SALES_AGENT {
          uuid
          userType
          fullName
        }
        RETENTION_AGENT {
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

const getBranchHierarchy = gql`query getBranchHierarchy (
  $operatorId: String!,
  $branchType: String!,
  $keyword: String,
  $officeUuid: String,
  $deskUuid: String,
  $deskType: DeskTypeEnum,
  $defaultDeskFlag: DeskDefaultFlagEnum,
  $country: String,
) {
  hierarchy {
    branchHierarchy (
      operatorId: $operatorId,
      branchType: $branchType,
      keyword: $keyword,
      officeUuid: $officeUuid,
      deskUuid: $deskUuid,
      deskType: $deskType,
      defaultDeskFlag: $defaultDeskFlag,
      country: $country,
    ) {
      data {
        office {
          uuid
          name
          country
          defaultUser
          defaultBranch
          parentBranches
        }
        desk {
          uuid
          name
          language
          deskType
          defaultUser
          defaultBranch
          parentBranches
          isDefault
        }
        team {
          uuid
          name
          defaultUser
          defaultBranch
          parentBranches
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const getUsersByBranch = gql`query getUsersByBranch(
  $uuid: String!,
) {
  hierarchy {
    usersByBranch (
      uuid: $uuid,
    ) {
      error {
        error
        fields_errors
      }
      data {
        uuid
        userType
        fullName
        parentUsers
        parentBranches
      }
    } 
  }
}`;

export {
  getUserBranchHierarchy,
  getHierarchyUsersByType,
  getBranchInfo,
  getBranchHierarchy,
  getUsersByBranch,
};
