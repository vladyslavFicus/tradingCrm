import gql from 'graphql-tag';

const locksQuery = gql`query locksQuery($playerUUID: String!){
  paymentLocks(playerUUID: $playerUUID) {
    payment {
      type
      author
      canUnlock
      authorUUID
      id
      playerUUID
      reason
      startLock
    }
    login {
      locked
      expirationDate
      reason
    }
  }
}`;

export {
  locksQuery,
};

