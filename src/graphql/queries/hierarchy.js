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
          brandId
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

const getUserBranchHierarchy = gql`query getUserBranchHierarchy(
  $withoutBrandFilter: Boolean,
) {
  hierarchy {
    userBranchHierarchy (
      withoutBrandFilter: $withoutBrandFilter,
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
          brandId
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
          brandId
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
          brandId
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
  $onlyActive: Boolean,
) {
  hierarchy {
    hierarchyUsersByType (
      userTypes: $userTypes,
      onlyActive: $onlyActive,
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
          operatorStatus
        }
        BRAND_ADMIN {
          uuid
          userType
          fullName
          operatorStatus
        }
        SALES_AGENT {
          uuid
          userType
          fullName
          operatorStatus
        }
        RETENTION_AGENT {
          uuid
          userType
          fullName
          operatorStatus
        }
        SALES_HOD {
          uuid
          userType
          fullName
          operatorStatus
        }
        SALES_MANAGER {
          uuid
          userType
          fullName
          operatorStatus
        }
        SALES_LEAD {
          uuid
          userType
          fullName
          operatorStatus
        }
        RETENTION_HOD {
          uuid
          userType
          fullName
          operatorStatus
        }
        RETENTION_MANAGER {
          uuid
          userType
          fullName
          operatorStatus
        }
        RETENTION_LEAD {
          uuid
          userType
          fullName
          operatorStatus
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
  getBranchHierarchyTree,
  getUsersByBranch,
  getBranchChildren,
};
