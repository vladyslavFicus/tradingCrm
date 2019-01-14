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
        _id
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
        salesAgent {
          fullName
          uuid
          hierarchy {
            parentBranches {
              name
              branchType
              parentBranch {
                name
                branchType
              }
            }
          }
        }
        salesStatus
        birthDate
        affiliate
        gender
        city
        language
        registrationDate
        statusChangedDate
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
      _id
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
      salesAgent {
        fullName
        uuid
      }
      salesStatus
      birthDate
      affiliate
      gender
      city
      language
      registrationDate
      statusChangedDate
    }
  } 
}`;

export {
  leadsQuery,
  leadProfileQuery,
};
