import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/* eslint-disable */
const REQUEST = gql`
  query ClientsDistributionRuleQuery($uuid: String!) {
    distributionRule (uuid: $uuid) {
      _id
      uuid
      name
      # order
      # status
      createdBy
      # statusChangedAt
      # createdAt
      countries
      salesStatuses
      targetSalesStatus
      registrationPeriodInHours
      executionType
      executionPeriodInHours
      # latestMigration {
      #   uuid
      #   startDate
      #   clientsAmount
      #   status
      #   ruleUuid
      # }
      sourceBrandConfigs {
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        sortType
      }
      targetBrandConfigs {
        brand
        distributionUnit {
          quantity
          baseUnit
        }
        operator
      }
    }
  }
`;

const ClientsDistributionRuleQuery = ({ children, match: { params: { id } } }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: '52eb058f-5e99-4dc4-ad25-f8d6b2bec0d4' }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

ClientsDistributionRuleQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ClientsDistributionRuleQuery;
