import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const getFilesByProfileUUID = gql`query clientFiles(
  $size: Int,
  $page: Int,
  $clientUuid: String!,
  $searchBy: String,
  $fileCategory: String,
  $uploadDateFrom: String,
  $uploadDateTo: String,
){
  clientFiles(
    size: $size,
    page: $page,
    clientUuid: $clientUuid,
    searchBy: $searchBy,
    fileCategory: $fileCategory,
    uploadDateFrom: $uploadDateFrom,
    uploadDateTo: $uploadDateTo,
  ) {
    data {
      verificationType
      attemptsLeft
      documents {
        documentType
        verificationTime
        verifiedBy
        verificationStatus
        files {
          _id
          clientUuid
          client {
            fullName
          }
          fileName
          title
          documentType
          mediaType
          status
          uploadBy
          uuid
          verificationType
          type
          uploadDate
          expirationDate
          note {
          ...NoteFragment,
          }
        }
      }
    }
  }
}
${NoteFragment}`;

const getFilesCategories = gql`query FilesCategories {
  filesCategories {
    data {
      DOCUMENT_VERIFICATION
      ADDRESS_VERIFICATION
      OTHER
    }
  }
}`;

export {
  getFilesByProfileUUID,
  getFilesCategories,
};
