import gql from 'graphql-tag';

const lockMutation = gql`mutation lock($playerUUID: String!, $reason: String!, $type: String!) {
  payment {
    lock(reason: $reason, playerUUID: $playerUUID, type: $type) {
      data {
        id
        type
        author
        canUnlock
        authorUUID
        playerUUID
        reason
        startLock
      }
      error {
        error
      }
    }
  }
}`;

const unlockMutation = gql`mutation unlock($playerUUID: String!, $reason: String!, $type: String!) {
  payment {
    unlock(reason: $reason, playerUUID: $playerUUID, type: $type) {
      data {
        id
      }
      error {
        error
      }
    }
  }
}`;

export {
  lockMutation,
  unlockMutation,
};
