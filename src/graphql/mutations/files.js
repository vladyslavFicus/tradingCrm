import gql from 'graphql-tag';

const refuseMutation = gql`mutation fileRefuseMutation(
  $uuid: String!
) {
  file {
    refuse(uuid: $uuid) {
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

const deleteMutation = gql`mutation fileDeleteMutation(
  $uuid: String!
  $playerUUID: String!
) {
  file {
    delete(uuid: $uuid, playerUUID: $playerUUID) {
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
  $fileUUID: String!
  $documentStatus: String!
) {
  file {
    updateFileStatus(fileUUID: $fileUUID, documentStatus: $documentStatus) {
      success
    }
  }
}`;

export {
  deleteMutation,
  refuseMutation,
  verifyMutation,
  updateFileStatusMutation,
};
