import gql from 'graphql-tag';
import { HierarchyBranchFragment } from '../fragments/hierarchy';

const getUserHierarchy = gql`query getUserHierarchy {
  userHierarchy {
    parentBranches {
      uuid
      branchType
      name
    }
  }
}`;

const getUserHierarchyById = gql`query getUserHierarchyById(
  $uuid: String!,
) {
  userHierarchyById (
    uuid: $uuid,
  ) {
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
}`;

const getUserBranchHierarchy = gql`query getUserBranchHierarchy(
  $withoutBrandFilter: Boolean,
) {
  userBranches (
    withoutBrandFilter: $withoutBrandFilter,
  ) {
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
  fragment BranchTreeItem on HierarchyBranchTree {
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

  query getBranchHierarchyTree($branchUuid: String!) {
    # Maximum nested branches == 5 [COMPANY, BRAND, OFFICE, DESK, TEAM]
    branchTree(branchUuid: $branchUuid) {
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
