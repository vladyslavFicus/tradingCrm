import gql from 'graphql-tag';

const getClientPaymentsByUuid = gql`query getClientPayments(
  $playerUUID: String!,
  $searchValue: String,
  $type: String,
  $page: Int,
) {
  clientPaymentsByUuid (
    playerUUID: $playerUUID,
    searchValue: $searchValue,
    type: $type,
    page: $page,
  ) {
    size
    page
    number
    totalElements
    last
    content {
      paymentId
      playerUUID
      creatorUUID
      transactionTag
      paymentSystemRefs
      paymentType
      amount {
        amount
        currency
      }
      amountBarrierReached
      creationTime
      country
      clientIp
      paymentMethod
      paymentAccount
      mobile
      userAgent
      playerProfile {
        age
        playerUUID
        firstName
        lastName
        login
        kycCompleted
        languageCode
      }
      paymentFlowStatuses {
        creationTime
        initiatorId
        initiatorType
        paymentStatus
        reason
        reference
      }
      status
      creatorType
      currency
      needApprove
      fraud
      tradingAcc
      symbol
      accountType
      externalReference
    }
  } 
}`;

export {
  getClientPaymentsByUuid,
};
