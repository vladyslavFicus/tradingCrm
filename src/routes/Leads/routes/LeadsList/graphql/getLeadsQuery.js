import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query LeadsList_getLeadsQuery(
  $uuids: [String]
  $searchKeyword: String
  $registrationDateStart: String
  $registrationDateEnd: String
  $page: Int
  $limit: Int
  $countries: [String]
  $salesAgents: [String]
  $status: String
  $salesStatuses: [tradingProfileSalesStatus]
  $migrationId: String
  $lastNoteDateFrom: String
  $lastNoteDateTo: String
) {
  leads (
    uuids: $uuids
    searchKeyword: $searchKeyword
    registrationDateStart: $registrationDateStart
    registrationDateEnd: $registrationDateEnd
    lastNoteDateFrom: $lastNoteDateFrom
    lastNoteDateTo: $lastNoteDateTo
    limit: $limit
    page: $page
    countries: $countries
    salesStatuses: $salesStatuses
    salesAgents: $salesAgents
    status: $status
    migrationId: $migrationId
  ) {
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
    error {
      error
    }
  }
}`;

const getLeadsQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      ...query && query.filters,
      page: 0,
      limit: 20,
    }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getLeadsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      filters: PropTypes.object,
    }),
  }).isRequired,
};

export default getLeadsQuery;