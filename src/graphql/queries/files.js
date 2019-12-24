import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const getFilesListByProfileUUID = gql`query files(
  $size: Int,
  $page: Int,
  $clientUUID: String!,
  $searchBy: String,
  $fileCategory: String,
  $uploadDateFrom: String,
  $uploadDateTo: String,
){
  filesByUuid(
    size: $size,
    page: $page,
    clientUUID: $clientUUID,
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
          statusDocument
          uploadBy
          uuid
          verificationType
          status {
            value
            comment
            editDate
            author
          }
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

const getFilesList = gql`query fileList(
  $size: Int,
  $page: Int,
  $searchBy: String, 
  $uploadedDateFrom: String,
  $uploadedDateTo: String,
  $verificationType: String,
  $documentType: String,
){
  fileList(
    size: $size,
    page: $page,
    searchBy: $searchBy,
    uploadedDateFrom: $uploadedDateFrom,
    uploadedDateTo: $uploadedDateTo,
    verificationType: $verificationType,
    documentType: $documentType,
  ) {
    data {
      last
      number
      page
      totalElements
      totalPages
      content {
        clientUuid
        client {
          fullName
        }
        fileName
        title
        documentType
        statusDocument
        uploadBy
        uuid
        verificationType
        status {
          value
          comment
          editDate
          author
        }
        type
        uploadDate
        expirationDate
      }
    }
  }
}`;

const getFilesCategoriesList = gql`query filesCategoriesList {
  filesCategoriesList {
    data {
      DOCUMENT_VERIFICATION
      ADDRESS_VERIFICATION
      OTHER
    }
  }
}`;

export {
  getFilesListByProfileUUID,
  getFilesCategoriesList,
  getFilesList,
};
