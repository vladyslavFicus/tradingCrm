import gql from 'graphql-tag';

const uploadFileMutation = gql`
  mutation uploadFileMutation(
    $file: Upload!
    $uuid: String!
  ) {
    file {
      upload(
        file: $file
        uuid: $uuid
      ) {
        data {
          fileUuid
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

const confirmFilesUploadingMutation = gql`
  mutation confirmFilesUploadingMutation(
    $documents: [FileToUpload]!
    $profileUuid: String!
  ) {
    file {
      confirmFilesUploading(
        documents: $documents
        profileUuid: $profileUuid
      )
    }
  }
`;

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
  $verificationType: String
  $documentType: String
  $status: String
) {
  file {
    updateFileMeta(
      uuid: $uuid,
      verificationType: $verificationType,
      documentType: $documentType,
      status: $status
    )
  }
}`;

export {
  uploadFileMutation,
  updateFileMetaMutation,
  updateFileStatusMutation,
  confirmFilesUploadingMutation,
};
