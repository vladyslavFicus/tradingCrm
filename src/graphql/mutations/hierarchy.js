import gql from 'graphql-tag';

const createOffice = gql`mutation createOffice(
  $name: String!,
  $country: String!,
  $officeManager: String!,
) {
  hierarchy {
    createOffice (
      name: $name,
      country: $country,
      officeManager: $officeManager,
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
    }
  }
}`;

export {
  createOffice,
  createDesk,
  createTeam,
  addOperatorToBranch,
};
