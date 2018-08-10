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

const addPaymentMutation = gql`mutation createClientPayment(
  $amount: Int!,
  $currency: String!
  $playerUUID: String!,
  $paymentType: String!,
  $paymentAccountUuid: String,
  $externalReference: String,
  $mt4Acc:String,
) {
  payment {
    createClientPayment (
      amount: $amount,
      currency: $currency,
      playerUUID: $playerUUID,
      paymentType: $paymentType,
      paymentAccountUuid: $paymentAccountUuid,
      externalReference: $externalReference,
      mt4Acc: $mt4Acc,
    ) {
      data {
        paymentId
        redirectLink
        generationDate
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
  addPaymentMutation,
};
