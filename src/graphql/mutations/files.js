import gql from 'graphql-tag';

const uploadFileMutation = gql`
  mutation uploadFileMutation(
    $file: Upload!
    $profileUUID: String!
  ) {
    file {
      upload(
        file: $file
        profileUUID: $profileUUID
      ) {
        data {
          fileUUID
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
`;

const confirmUploadedFilesMutation = gql`
  mutation confirmUploadedFilesMutation(
    $documents: [InputFileType]!
    $profileUuid: String!
  ) {
    file {
      confirmFiles(
        documents: $documents
        profileUuid: $profileUuid
      ) {
        data {
          success
        }
      }
    }
  }
`;

const verifyMutation = gql`mutation fileVerifyMutation(
  $uuid: String!
) {
  file {
    verify(uuid: $uuid) {
      data {
        _id
        status {
          author
          comment
          editDate
          value
        }
      }
    }
  }
}`;

const deleteMutation = gql`mutation fileDeleteMutation($uuid: String!) {
  file {
    delete(uuid: $uuid) {
      data {
        _id
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const updateFileStatusMutation = gql`mutation updateFileStatusMutation(
  $clientUuid: String!
  $verificationType: String
  $documentType: String
  $verificationStatus: String
) {
  file {
    updateFileStatus(
      clientUuid: $clientUuid,
      verificationType: $verificationType,
      documentType: $documentType,
      verificationStatus: $verificationStatus
    ) {
      success
    }
  }
}`;

const updateFileMetaMutation = gql`mutation updateFileMetaMutation(
  $uuid: String!
  $verificationType: String
  $documentType: String
) {
  file {
    updateFileMeta(
      uuid: $uuid,
      verificationType: $verificationType,
      documentType: $documentType,
    ) {
      success
    }
  }
}`;

export {
  // New one
  uploadFileMutation,
  confirmUploadedFilesMutation,

  deleteMutation,
  verifyMutation,
  updateFileStatusMutation,
  updateFileMetaMutation,
};
