import gql from 'graphql-tag';

const leadsQuery = gql`query getLeads(
  $searchValue: String,
  $registrationDateStart: String,
  $registrationDateEnd: String,
  $page: Int,
  $limit: Int,
  $country: String,
  $salesStatus: tradingProfileSalesStatus,
) {
  leads (
    searchValue: $searchValue,
    registrationDateStart: $registrationDateStart,
    registrationDateEnd: $registrationDateEnd,
    limit: $limit,
    page: $page,
    country: $country,
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
        phone
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
      } 
    }
  } 
}`;

export {
  leadsQuery,
};
