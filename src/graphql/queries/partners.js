import gql from 'graphql-tag';

// # TODO: remove after Payments will be refactored
const partnersQuery = gql`query getPartners(
  $searchBy: String,
  $country: String,
  $status: String,
  $registrationDateFrom: String,
  $registrationDateTo: String,
) {
  partners (
    searchBy: $searchBy,
    country: $country,
    status: $status,
    registrationDateFrom: $registrationDateFrom,
    registrationDateTo: $registrationDateTo,
  ) {
    data {
      page
      number
      totalElements
      size
      last
      content {
        uuid
        fullName
        createdAt
        status
        statusChangeDate
        country
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

// # TODO: remove after PartnerProfile page will be refactored
const partnerQuery = gql`query getPartnerByUUID(
  $uuid: String!,
) {
  partner(uuid: $uuid) {
    data {
      _id
      uuid
      firstName
      lastName
      fullName
      email
      phone
      country
      status
      statusChangeDate
      statusChangeAuthor
      statusReason
      satellite
      createdBy
      createdAt
      externalAffiliateId
      affiliateType
      cellexpert
      public
      permission {
        allowedIpAddresses
        forbiddenCountries
        showNotes
        showSalesStatus
        showFTDAmount
      }
      authorities {
        data {
          brandId
          department
          id
          role
        }
      }
    }
    error {
      error
      fields_errors
    }
  }
}`;

export {
  partnersQuery,
  partnerQuery,
};
