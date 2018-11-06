import gql from 'graphql-tag';

const createOffice = gql`mutation createOffice(
  $name: String!,
  $country: String!,
  $officeManager: String!,
  $operatorId: String!,
) {
  hierarchy {
    createOffice (
      name: $name,
      country: $country,
      officeManager: $officeManager,
      operatorId: $operatorId,
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
  $operatorId: String!,
) {
  hierarchy {
    createDesk (
      name: $name,
      deskType: $deskType,
      language: $language,
      officeId: $officeId,
      operatorId: $operatorId,
    ) {
      data
      error
    }
  }
}`;

const createTeam = gql`mutation createTeam(
  $name: String!,
  $deskId: String!,
  $operatorId: String!,
) {
  hierarchy {
    createTeam (
      name: $name,
      deskId: $deskId,
      operatorId: $operatorId,
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
