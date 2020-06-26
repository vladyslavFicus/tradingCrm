import gql from 'graphql-tag';

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
  createTeam,
  createDesk,
  addOperatorToBranch,
  removeOperatorFromBranch,
  updateUser,
};
