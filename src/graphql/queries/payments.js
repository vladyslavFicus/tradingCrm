import gql from 'graphql-tag';
import { NoteFragment } from '../fragments/notes';

const getClientPayments = gql`query getClientPayments(
  $searchParam: String
  $type: String
  $page: Int
  $limit: Int
  $country: String
  $statuses: [String]
  $paymentTypes: [String]
  $paymentAggregator: String
  $paymentMethods: [String]
  $currency: String
  $creationTimeFrom: String
  $creationTimeTo: String
  $amountFrom: Float
  $amountTo: Float
  $agentIds: [String]
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
    paymentMethods: $paymentMethods
    currency: $currency
    creationTimeFrom: $creationTimeFrom
    creationTimeTo: $creationTimeTo
    amountFrom: $amountFrom
    amountTo: $amountTo
    agentIds: $agentIds
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        _id
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
        paymentMigrationId
        userMigrationId
        normalizedAmount
        declineReason
        playerProfile {
          uuid
          firstName
          lastName
          fullName
          country
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
        note {
          ...NoteFragment,
        }
      }
    }
    error {
      error
    }
  } 
}
${NoteFragment}`;

const getClientPaymentsByUuid = gql`query getClientPayments(
  $playerUUID: String!
  $searchParam: String
  $type: String
  $page: Int
  $limit: Int
  $statuses: [String]
  $paymentTypes: [String]
  $paymentAggregator: String  
  $paymentMethods: [String]
  $creationTimeFrom: String
  $creationTimeTo: String
  $amountFrom: Float
  $amountTo: Float
  $agentIds: [String]
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
    paymentMethods: $paymentMethods
    creationTimeFrom: $creationTimeFrom
    creationTimeTo: $creationTimeTo
    amountFrom: $amountFrom
    amountTo: $amountTo
    agentIds: $agentIds
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        _id
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
        paymentMigrationId
        userMigrationId
        normalizedAmount
        declineReason
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
        note {
          ...NoteFragment,
        }
      }
    }
    error {
      error
    }
  } 
}
${NoteFragment}`;

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
