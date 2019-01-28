import gql from 'graphql-tag';
import { HierarchyBranchFragment } from '../fragments/hierarchy';

const getUserHierarchy = gql`query getUserHierarchy {
  hierarchy {
    userHierarchy {
      data {
        parentBranches {
          uuid
          branchType
          name
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const getUserHierarchyById = gql`query getUserHierarchyById(
  $userId: String!,
) {
  hierarchy {
    userHierarchyById (
      userId: $userId,
    ) {
      data {
        uuid
        userType
        parentUsers {
          uuid
          userType
        }
        parentBranches {
          branchType
          uuid
          name
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

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
          parentBranch {
            uuid
          }
        }
        DESK {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          deskType
          language
          parentBranch {
            uuid
          }
          isDefault
        }
        TEAM {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          parentBranch {
            uuid
          }
        }
        BRAND {
          name
          uuid
          branchType
          defaultUser
          defaultBranch
          country
          parentBranch {
            uuid
          }
          isDefault
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
        SALES_HOD {
          uuid
          userType
          fullName
        }
        SALES_MANAGER {
          uuid
          userType
          fullName
        }
        SALES_LEAD {
          uuid
          userType
          fullName
        }
        RETENTION_HOD {
          uuid
          userType
          fullName
        }
        RETENTION_MANAGER {
          uuid
          userType
          fullName
        }
        RETENTION_LEAD {
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
        ...HierarchyBranchFragment
        parentBranch {
          ...HierarchyBranchFragment
        }
      }
    } 
  }
}
${HierarchyBranchFragment}`;

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
          parentBranch {
            uuid
          }
        }
        desk {
          uuid
          name
          language
          deskType
          defaultUser
          defaultBranch
          parentBranch {
            uuid
          }
          isDefault
        }
        team {
          uuid
          name
          defaultUser
          defaultBranch
          parentBranch {
            uuid
          }
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const getBranchHierarchyTree = gql`  
  fragment BranchTreeItem on HierarchyBranchTreeType {
    uuid
    name
    branchType
    deskType
    users {
      uuid
      userType
      operator {
        fullName
      }
    }
  }
  
  query getBranchHierarchyTree($branchUUID: String!) {
    hierarchy {
      # Maximum nested branches == 5 [COMPANY, BRAND, OFFICE, DESK, TEAM]
      branchHierarchyTree(branchUUID: $branchUUID) {
        data {
          ...BranchTreeItem
          children {
            ...BranchTreeItem
            children {
              ...BranchTreeItem
              children {
                ...BranchTreeItem
                children {
                  ...BranchTreeItem
                }
              }
            }
          }
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

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

const getBranchChildren = gql`query getBranchChildren(
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

export {
  getUserHierarchy,
  getUserHierarchyById,
  getUserBranchHierarchy,
  getHierarchyUsersByType,
  getBranchInfo,
  getBranchHierarchy,
  getBranchHierarchyTree,
  getUsersByBranch,
  getBranchChildren,
};
