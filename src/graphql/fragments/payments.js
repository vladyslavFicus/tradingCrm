import gql from 'graphql-tag';

const PaymentContentFragment = gql`fragment PaymentContentFragment on PaymentTrading {
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
    ...NoteFragment
  }
  modificationTime
  modifiedBy
  statusChangedAt
}`;

export {
  PaymentContentFragment,
};
