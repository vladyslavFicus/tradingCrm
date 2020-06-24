import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

const REQUEST = gql`
  query ClientsQuery($args: ClientSearch__Input) {
    profiles(args: $args) {
      error {
        error
      }
      data {
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
          balance {
            amount
          }
          firstName
          languageCode
          lastName
          lastNote {
            changedAt
            content
            uuid
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
        }
      }
    }
  }
`;

const ClientsQuery = ({ children, size }) => (
  <Query
    query={REQUEST}
    variables={{
      args: {
        page: {
          from: 0,
          size,
        },
      },
    }}
  >
    {children}
  </Query>
);

ClientsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
};

export default ClientsQuery;
