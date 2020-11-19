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
      acquisition {
        salesStatus
        salesOperator {
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
      }
    }
  }
}`;

const getLeadsQuery = ({ children, location: { state } }) => {
  const filters = state?.filters;
  const searchLimit = filters?.searchLimit;
  const size = (searchLimit && searchLimit < 20) ? searchLimit : 20;

  return (
    <Query
      query={REQUEST}
      variables={{
        args: {
          ...filters,
          page: {
            from: 0,
            size,
            sorts: state?.sorts,
          },
        },
      }}
      fetchPolicy="cache-and-network"
      context={{ batch: false }}
    >
      {children}
    </Query>
  );
};

getLeadsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.pageable.isRequired,
    }),
  }).isRequired,
};

export default getLeadsQuery;
