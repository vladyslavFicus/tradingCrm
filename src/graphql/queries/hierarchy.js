import gql from 'graphql-tag';
import { HierarchyBranchFragment, HierarchyUserBranchFragment } from '../fragments/hierarchy';

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

const getUserBranchesTreeUp = gql`query getUserBranchesTreeUp(
  $userUUID: String!
) {
  # Maximum nested branches == 5 [COMPANY, BRAND, OFFICE, DESK, TEAM]
  userBranchesTreeUp (
    userUUID: $userUUID,
  ) {
    ...HierarchyUserBranchFragment
    parentBranch {
      ...HierarchyUserBranchFragment
      parentBranch {
        ...HierarchyUserBranchFragment
        parentBranch {
          ...HierarchyUserBranchFragment
          parentBranch {
            ...HierarchyUserBranchFragment
          }
        }
      }
    }
  }
}
${HierarchyUserBranchFragment}`;

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


export {
  getUserHierarchy,
  getUserHierarchyById,
  getUserBranchHierarchy,
  getBranchInfo,
  getUserBranchesTreeUp,
};
