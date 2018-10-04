import gql from 'graphql-tag';

const createOffice = gql`mutation createOffice(
  $name: String!,
  $country: String!,
  $officeManager: String!,
  $operatorBranches: [String],
  $operatorId: String!,
  $userType: String!,
) {
  hierarchy {
    createOffice (
      name: $name,
      country: $country,
      officeManager: $officeManager,
      operatorBranches: $operatorBranches,
      operatorId: $operatorId,
      userType: $userType,
    ) {
      data
      error
    }
  }
}`;

const createDesk = gql`mutation createDesk(
  $name: String!,
  $deskType: String!,
  $language: String!,
  $officeId: String!,
  $operatorBranches: [String],
  $operatorId: String!,
  $userType: String!,
) {
  hierarchy {
    createDesk (
      name: $name,
      deskType: $deskType,
      language: $language,
      officeId: $officeId,
      operatorBranches: $operatorBranches,
      operatorId: $operatorId,
      userType: $userType,
    ) {
      data
      error
    }
  }
}`;

const createTeam = gql`mutation createTeam(
  $name: String!,
  $officeId: String!,
  $deskId: String!,
  $operatorBranches: [String],
  $operatorId: String!,
  $userType: String!,
) {
  hierarchy {
    createTeam (
      name: $name,
      officeId: $officeId,
      deskId: $deskId,
      operatorBranches: $operatorBranches,
      operatorId: $operatorId,
      userType: $userType,
    ) {
      data
      error
    }
  }
}`;

export {
  createOffice,
  createDesk,
  createTeam,
};
