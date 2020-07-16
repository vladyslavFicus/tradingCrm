import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query LeadsList_getLeadsQuery(
  $args: LeadSearch__Input
) {
  leads (
    args: $args
  ) {
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
        operator {
          fullName
        }
      }
    }
  }
}`;

const getLeadsQuery = ({ children, location: { query } }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        ...query && query.filters,
        page: {
          from: 0,
          size: 20,
          sorts: (query) ? query.sorts : [],
        },
      },
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
      sorts: PropTypes.pageable.isRequired,
    }),
  }).isRequired,
};

export default getLeadsQuery;
