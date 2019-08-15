import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const filesQuery = gql`query files(
  $size: Int,
  $page: Int,
  $playerUUID: String!,
  $searchBy: String,
  $fileCategory: String,
  $uploadDateFrom: String,
  $uploadDateTo: String,
){
  files(
    size: $size,
    page: $page,
    playerUUID: $playerUUID,
    searchBy: $searchBy,
    fileCategory: $fileCategory,
    uploadDateFrom: $uploadDateFrom,
    uploadDateTo: $uploadDateTo,
  ) {
    last
    number
    page
    size
    totalElements
    totalPages
    content {
      _id
      uuid
      playerUUID
      targetUUID
      name
      realName
      author
      category
      statusDocument
      status {
        value
        comment
        editDate
        author
      }
      type
      uploadDate
      expirationTime
      note {
        ...NoteFragment,
      }
    }
  }
}
${NoteFragment}`;

const fileListQuery = gql`query fileList(
  $size: Int,
  $page: Int,
  $searchBy: String,
  $uploadDateFrom: String,
  $uploadDateTo: String,
  $documentStatus: String,
){
  fileList(
    size: $size,
    page: $page,
    searchBy: $searchBy,
    uploadDateFrom: $uploadDateFrom,
    uploadDateTo: $uploadDateTo,
    documentStatus: $documentStatus,
  ) {
    last
    number
    page
    size
    totalElements
    totalPages
    content {
      _id
      uuid
      playerUUID
      targetUUID
      fullName
      fileName
      realName
      author
      documentCategory
      statusDocument
      status {
        value
        comment
        editDate
        author
      }
      type
      uploadDate
      expirationTime
    }
  }
}`;

export {
  filesQuery,
  fileListQuery,
};
