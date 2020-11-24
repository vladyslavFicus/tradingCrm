import { gql } from '@apollo/client';
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


export {
  getUserHierarchy,
  getUserBranchHierarchy,
  getBranchInfo,
};
