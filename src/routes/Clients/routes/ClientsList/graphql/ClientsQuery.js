import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query ClientsList_ClientsQuery(
  $args: ClientSearch__Input
) {
  profiles(
    args: $args
  ) {
    page
    number
    totalElements
    totalPages
    size
    last
    content {
      acquisition {
        acquisitionStatus
        retentionStatus
        retentionRepresentative
        retentionOperator {
          fullName
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
        salesRepresentative
        salesOperator {
          fullName
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
      address {
        countryCode
      }
      affiliate {
        uuid
        source
        campaignId
        partner {
          fullName
        }
      }
      referrer {
        fullName
        uuid
      }
      balance {
        amount
      }
      firstName
      languageCode
      lastName
      lastNote {
        changedAt
        content
        operator {
          fullName
        }
      }
      paymentDetails {
        depositsCount
        lastDepositTime
      }
      registrationDetails {
        registrationDate
      }
      status {
        changedAt
        type
      }
      uuid
      lastActivity {
        date
      }
      warnings
      online
      lastCall {
        createdAt
        callSystem
      }
    }
  }
}`;

const ClientsQuery = ({ children, location: { state } }) => {
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
      fetchPolicy="network-only"
      errorPolicy="all"
      context={{ batch: false }}
    >
      {children}
    </Query>
  );
};

ClientsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      filters: PropTypes.object,
      sorts: PropTypes.array,
    }),
  }).isRequired,
};

export default ClientsQuery;
