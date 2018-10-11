import gql from 'graphql-tag';

const getClientPayments = gql`query getClientPayments(
  $keyword: String
  $type: String
  $page: Int
  $size: Int
  $countryCode: String
  $statuses: [String]
  $paymentMethod: String
  $currency: String
  $startDate: String
  $endDate: String
  $amountLowerBound: String
  $amountUpperBound: String
  $playerUUIDs: [String]
) {
  clientPayments (
    keyword: $keyword
    type: $type
    page: $page
    size: $size
    countryCode: $countryCode
    statuses: $statuses
    paymentMethod: $paymentMethod
    currency: $currency
    startDate: $startDate
    endDate: $endDate
    amountLowerBound: $amountLowerBound
    amountUpperBound: $amountUpperBound
    playerUUIDs: $playerUUIDs
  ) {
    page
    number
    totalElements
    size
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
        countryCode
      }
      paymentFlowStatuses {
        creationTime
        initiatorId
        initiatorType
        paymentStatus
        reason
        reference
      }
      creatorType
      needApprove
      fraud
      status
      currency
      tradingAcc
      symbol
      accountType
      externalReference
    }
  } 
}`;

const getClientPaymentsByUuid = gql`query getClientPayments(
  $playerUUID: String!
  $searchValue: String
  $type: String
  $page: Int
  $size: Int
  $country: String
  $statuses: [String]
  $paymentMethod: String
  $accountType: String
  $startDate: String
  $endDate: String
  $amountLowerBound: String
  $amountUpperBound: String
) {
  clientPaymentsByUuid (
    playerUUID: $playerUUID
    searchValue: $searchValue
    type: $type
    page: $page
    size: $size
    country: $country
    statuses: $statuses
    paymentMethod: $paymentMethod
    accountType: $accountType
    startDate: $startDate
    endDate: $endDate
    amountLowerBound: $amountLowerBound
    amountUpperBound: $amountUpperBound
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

const getOperatorPaymentMethods = gql`query getOperatorPaymentMethods {
  operatorPaymentMethods {
    data {
      _id
      methodName
      uuid
    }
    error {
      error
    }
  } 
}`;

const getPaymentLimitRegulation = gql`query getPaymentLimitRegulation($playerUUID: String!) {
  getRegulation(playerUUID: $playerUUID) {
    data {
      _id
      uuid
      playerUUID
      creationDate
      startDate
      expirationDate
      status
      author
      statusAuthor
      period
      type
      value {
        type
        limit {
          amount
          currency
        }
        used {
          amount
          currency
        }
        left {
          amount
          currency
        }
      }
    }
    error {
      error
    }
  } 
}`;

export {
  getClientPayments,
  getOperatorPaymentMethods,
  getClientPaymentsByUuid,
  getPaymentLimitRegulation,
};
