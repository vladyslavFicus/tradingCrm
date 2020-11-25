import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { initialRegistrationQueryParams } from '../../dashboardChartsUtils';

export const REQUEST = gql`
  query RegistrationsChart_getRegisteredUsersStatistic(
    $dateFrom: String!
    $dateTo: String!
    $detalization: StatisticDetalization__Enum
    $additionalStatistics: [RegistrationStatisticDateRange__Input]
  ) {
    registrationStatistic(
      additionalStatistics: $additionalStatistics
      detalization: $detalization
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      additionalStatistics {
        today {
          value
        }
        month {
          value
        }
        total {
          value
        }
      }
      registrations {
        entries
        entryDate
      }
    }
  }
`;

const RegisteredUsersStatistic = ({ children }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{
      ...initialRegistrationQueryParams('dateFrom', 'dateTo'),
    }}
  >
    {children}
  </Query>
);

RegisteredUsersStatistic.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RegisteredUsersStatistic;
