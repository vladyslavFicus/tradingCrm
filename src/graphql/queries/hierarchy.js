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

const getBranchInfo = gql`query getBranchInfo(
  $branchId: String!,
) {
  branchInfo (
    branchId: $branchId,
  ) {
    ...HierarchyBranchFragment
    parentBranch {
      ...HierarchyBranchFragment
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


export {
  getUserHierarchy,
  getUserHierarchyById,
  getUserBranchHierarchy,
  getBranchInfo,
  getBranchHierarchyTree,
};
