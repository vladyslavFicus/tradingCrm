import gql from 'graphql-tag';

const leadsQuery = gql`query getLeads(
  $ids: [String]!,
  $nameOrEmailOrId: String,
  $registrationDateStart: String,
  $registrationDateEnd: String,
  $page: Int,
  $limit: Int,
  $countries: [String],
  $salesStatus: tradingProfileSalesStatus,
) {
  leads (
    ids: $ids,
    nameOrEmailOrId: $nameOrEmailOrId,
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
