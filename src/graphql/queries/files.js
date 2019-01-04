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
      status {
        value
        comment
        editDate
        author
      }
      type
      uploadDate
      note {
        ...NoteFragment,
      }
    }
  }
}
${NoteFragment}`;

export {
  filesQuery,
};
