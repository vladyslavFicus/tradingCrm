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

const addOperatorToBranch = gql`mutation addOperatorToBranch(
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

const removeOperatorFromBranch = gql`mutation removeOperatorFromBranch(
$branchId: String!
$operatorId: String!
) {
  hierarchy {
    removeOperatorFromBranch (
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
) {
  hierarchy {
    updateUser (
      operatorId: $operatorId
      userType: $userType
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
  addOperatorToBranch,
  removeOperatorFromBranch,
  updateUser,
};
