import gql from 'graphql-tag';

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

export {
  getUserBranchHierarchy,
};
