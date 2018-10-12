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
  $country: String,
  $language: String,
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
      country: $country,
      language: $language,
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

const createDepositMutation = gql`mutation createDeposit(
  $playerUUID: String!,
  $currency: String!,
  $paymentMethod: String!, 
  $amount: Float!,
  $device: FingerprintInput
) {
  payment {
    createDeposit(
      playerUUID: $playerUUID,
      currency: $currency,
      paymentMethod: $paymentMethod, 
      amount: $amount,
      device: $device
    ) {
      data {
        paymentId
        redirectLink
        redirecting
      }
      error {
        error
      }
    }
  }
}`;

const createWithdrawMutation = gql`mutation createDeposit(
  $playerUUID: String!,
  $currency: String!,
  $paymentMethod: String!, 
  $amount: Float!,
  $email: String,
  $iban: String,
  $bic: String, 
  $device: FingerprintInput
) {
  payment {
    createWithdraw(
      playerUUID: $playerUUID,
      currency: $currency,
      paymentMethod: $paymentMethod, 
      amount: $amount,
      email: $email,
      iban: $iban,
      bic: $bic, 
      device: $device
    ) {
      data {
        paymentId
        redirectLink
        redirecting
      }
      error {
        error
      }
    }
  }
}`;

const cancelRegulationLimitMutation = gql`mutation cancel($playerUUID: String!, $uuid: String!) {
  paymentLimit {
    cancel(playerUUID: $playerUUID, uuid: $uuid) {
      data {
        _id
        status
      }
      error {
        error
      }
    }
  }
}`;

export {
  lockMutation,
  createWithdrawMutation,
  unlockMutation,
  addPaymentMutation,
  createDepositMutation,
  cancelRegulationLimitMutation,
};
