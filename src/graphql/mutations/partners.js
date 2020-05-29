import gql from 'graphql-tag';

const updatePartner = gql`mutation updatePartner(
  $uuid: String!
  $firstName: String!
  $lastName: String!
  $phone: String
  $country: String
  $email: String
  $permission: PartnerPermissionUpdate
  $externalAffiliateId: String
  $public: Boolean
  $tradingAccountAutocreation: String
  $tradingAccountType: String
  $tradingAccountCurrency: String
) {
  partner {
    updatePartner(
      uuid: $uuid
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      country: $country
      email: $email
      permission: $permission
      externalAffiliateId: $externalAffiliateId
      public: $public
      tradingAccountAutocreation: $tradingAccountAutocreation
      tradingAccountType: $tradingAccountType
      tradingAccountCurrency: $tradingAccountCurrency
    ) {
      data {
        _id
        country
        email
        fullName
        firstName
        lastName
        status
        phone
        externalAffiliateId
        public
        createdBy
        createdAt
        tradingAccountAutocreation
        tradingAccountType
        tradingAccountCurrency
        statusChangeAuthor
        statusChangeDate
        statusReason
        uuid
        permission {
          allowedIpAddresses
          forbiddenCountries
          showNotes
          showSalesStatus
          showFTDAmount
          showKycStatus
        }
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

export {
  updatePartner,
};
