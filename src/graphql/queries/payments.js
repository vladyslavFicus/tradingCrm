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
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        login
        paymentId
        paymentType
        status
        currency
        createdBy
        creationTime
        paymentMethod
        paymentAggregator
        accountType
        amount
        country
        language
        brandId
        externalReference
        playerProfile {
          uuid
          firstName
          lastName
          fullName
        }
        paymentMetadata {
          clientIp
          isMobile
          userAgent
          country
        }
      }
    }
    error {
      error
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
    data {
      page
      number
      totalElements
      size
      last
      content {
        login
        paymentId
        paymentType
        status
        currency
        createdBy
        creationTime
        paymentMethod
        paymentAggregator
        accountType
        amount
        country
        language
        brandId
        externalReference
        playerProfile {
          uuid
          firstName
          lastName
          fullName
        }
        paymentMetadata {
          clientIp
          isMobile
          userAgent
          country
        }
      }
    }
    error {
      error
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


export {
  getClientPayments,
  getClientPaymentsByUuid,
  getOperatorPaymentMethods,
};
