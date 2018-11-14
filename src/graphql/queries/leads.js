import gql from 'graphql-tag';

const leadsQuery = gql`query getLeads(
  $ids: [String],
  $searchKeyword: String,
  $registrationDateStart: String,
  $registrationDateEnd: String,
  $page: Int,
  $limit: Int,
  $countries: [String],
  $salesStatus: tradingProfileSalesStatus,
) {
  leads (
    ids: $ids,
    searchKeyword: $searchKeyword,
    registrationDateStart: $registrationDateStart,
    registrationDateEnd: $registrationDateEnd,
    limit: $limit,
    page: $page, 
    countries: $countries,
    salesStatus: $salesStatus,
  ) {
    error {
      error
      fields_errors
    }
    data {
      page
      size
      last
      totalElements
      number
      content {
        id
        brandId
        name
        surname
        phoneCode
        phoneNumber
        phone
        mobileCode
        mobileNumber
        mobile
        status
        email
        country
        source
        salesAgent
        salesStatus
        birthDate
        affiliate
        gender
        city
        language
        registrationDate
        statusChangeDate
      } 
    }
  } 
}`;

const leadProfileQuery = gql`query getLeadProfile(
  $leadId: String!,
) {
  leadProfile (
    leadId: $leadId,
  ) {
    error {
      error
      fields_errors
    }
    data {
      id
      brandId
      name
      surname
      phoneCode
      phoneNumber
      phone
      mobileCode
      mobileNumber
      mobile
      status
      email
      country
      source
      salesAgent
      salesStatus
      birthDate
      affiliate
      gender
      city
      language
      registrationDate
      statusChangeDate
    }
  } 
}`;

export {
  leadsQuery,
  leadProfileQuery,
};
