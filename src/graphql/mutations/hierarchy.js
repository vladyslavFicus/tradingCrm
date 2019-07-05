import gql from 'graphql-tag';

const createHierarchyUser = gql`mutation createUser(
  $userId: String!,
  $userType: String!,
  $branchId: String,
) {
  hierarchy {
    createUser (
      userId: $userId
      userType: $userType
      branchId: $branchId
    ) {
      error {
        error
        fields_errors
      }
    }
  }
}`;

const createOffice = gql`mutation createOffice(
  $name: String!,
  $country: String!,
) {
  hierarchy {
    createOffice (
      name: $name,
      country: $country,
    ) {
      data
      error
    }
  }
}`;

const createDesk = gql`mutation createDesk(
  $name: String!,
  $deskType: DeskTypeEnum!,
  $language: String!,
  $officeId: String!,
) {
  hierarchy {
    createDesk (
      name: $name,
      deskType: $deskType,
      language: $language,
      officeId: $officeId,
    ) {
      data
      error
    }
  }
}`;

const createTeam = gql`mutation createTeam(
  $name: String!,
  $deskId: String!,
) {
  hierarchy {
    createTeam (
      name: $name,
      deskId: $deskId,
    ) {
      data
      error
    }
  }
}`;

const addOperatorToBranch = gql`mutation addOperator(
  $branchId: String!
  $operatorId: String!
) {
  hierarchy {
    addOperatorToBranch (
      branchId: $branchId
      operatorId: $operatorId
    ) {
      data
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updateUser = gql`mutation updateUser(
  $operatorId: String!
  $userType: String
  $assignToBranch: String
  $assignToOperator: String
  $unassignFromBranch: String
  $unassignFromOperator: String
  $parentBranches: [String]
  $parentUsers: [String]
) {
  hierarchy {
    updateUser (
      operatorId: $operatorId
      userType: $userType
      assignToBranch: $assignToBranch
      assignToOperator: $assignToOperator
      unassignFromBranch: $unassignFromBranch
      unassignFromOperator: $unassignFromOperator
      parentBranches: $parentBranches
      parentUsers: $parentUsers
    ) {
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  createHierarchyUser,
  createOffice,
  createDesk,
  createTeam,
  addOperatorToBranch,
  updateUser,
};
