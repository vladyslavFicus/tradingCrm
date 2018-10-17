import gql from 'graphql-tag';

const playerTagsQuery = gql`
  query getPlayerTags($playerUUID: String!, $pinned: Boolean) {
    playerTags(playerUUID: $playerUUID, pinned: $pinned) {
      content {
        tagId
        tagName
      }
    }
  }
`;

const tagsByTextQuery = gql`
  query getTagsByText($text: String!) {
    tagsByText(text: $text) {
      data {
        content {
          tagId
          tagName
        }
      }
    }
  }
`;

export {
  playerTagsQuery,
  tagsByTextQuery,
};
