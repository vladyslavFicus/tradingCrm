import gql from 'graphql-tag';

const getClientPayments = gql`query getClientPayments(
  $searchParam: String
  $type: String
  $page: Int
  $limit: Int
  $country: String
  $statuses: [String]
  $paymentTypes: [String]
  $paymentAggregator: String
  $paymentMethod: String
  $currency: String
  $creationTimeFrom: String
  $creationTimeTo: String
  $amountFrom: String
  $amountTo: String
) {
  clientPayments (
    searchParam: $searchParam
    type: $type
    page: $page
    limit: $limit
    country: $country
    statuses: $statuses
    paymentTypes: $paymentTypes
    paymentAggregator: $paymentAggregator
    paymentMethod: $paymentMethod
    currency: $currency
    creationTimeFrom: $creationTimeFrom
    creationTimeTo: $creationTimeTo
    amountFrom: $amountFrom
    amountTo: $amountTo
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
        originalAgent {
          uuid
          fullName
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
  $searchParam: String
  $type: String
  $page: Int
  $limit: Int
  $statuses: [String]
  $paymentTypes: [String]
  $paymentAggregator: String  
  $paymentMethod: String
  $creationTimeFrom: String
  $creationTimeTo: String
  $amountFrom: String
  $amountTo: String
) {
  clientPaymentsByUuid (
    playerUUID: $playerUUID
    searchParam: $searchParam
    type: $type
    page: $page
    limit: $limit
    statuses: $statuses
    paymentTypes: $paymentTypes
    paymentAggregator: $paymentAggregator    
    paymentMethod: $paymentMethod
    creationTimeFrom: $creationTimeFrom
    creationTimeTo: $creationTimeTo
    amountFrom: $amountFrom
    amountTo: $amountTo
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
        originalAgent {
          uuid
          fullName
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
