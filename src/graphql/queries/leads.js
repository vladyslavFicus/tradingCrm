import gql from 'graphql-tag';
import queryNames from 'constants/apolloQueryNames';

const leadsQuery = gql`query ${queryNames.leadsQuery}(
  $uuids: [String],
  $searchKeyword: String,
  $registrationDateStart: String,
  $registrationDateEnd: String,
  $page: Int,
  $limit: Int,
  $countries: [String],
  $salesAgents: [String],
  $status: String,
  $salesStatuses: [tradingProfileSalesStatus],
  $migrationId: String,
) {
  leads (
    uuids: $uuids,
    searchKeyword: $searchKeyword,
    registrationDateStart: $registrationDateStart,
    registrationDateEnd: $registrationDateEnd,
    limit: $limit,
    page: $page, 
    countries: $countries,
    salesStatuses: $salesStatuses,
    salesAgents: $salesAgents,
    status: $status,
    migrationId: $migrationId,
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
        uuid
        brandId
        name
        surname
        phone
        mobile
        status
        email
        country
        convertedByOperatorUuid
        convertedToClientUuid
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
        migrationId
        lastNote {
          changedAt
          content
        }
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
      uuid
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
      convertedByOperatorUuid
      convertedToClientUuid
      migrationId
    }
  } 
}`;

export {
  leadsQuery,
  leadProfileQuery,
};
