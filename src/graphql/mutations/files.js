import gql from 'graphql-tag';

const updateFileStatusMutation = gql`mutation updateFileStatusMutation(
  $uuid: String!
  $verificationType: String
  $documentType: String
  $verificationStatus: String
) {
  file {
    updateFileStatus(
      uuid: $uuid,
      verificationType: $verificationType,
      documentType: $documentType,
      verificationStatus: $verificationStatus
    )
  }
}`;

const updateFileMetaMutation = gql`mutation updateFileMetaMutation(
  $uuid: String!
  $title: String
  $verificationType: String
  $documentType: String
  $status: String
) {
  file {
    updateFileMeta(
      uuid: $uuid,
      title: $title,
      verificationType: $verificationType,
      documentType: $documentType,
      status: $status
    )
  }
}`;

export {
  updateFileMetaMutation,
  updateFileStatusMutation,
};
