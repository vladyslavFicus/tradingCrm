import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query GetSchedule($affiliateUuid: String!) {
  schedule (affiliateUuid: $affiliateUuid) {
    data {
      activated
      countrySpreads {
        country,
        limit,
      },
      day,
      totalLimit,
      workingHoursFrom,
      workingHoursTo,
    }
    error {
      error
    }
  }
}
`;

const GetSchedule = ({ children, affiliateUuid }) => (
  <Query
    query={REQUEST}
    variables={{ affiliateUuid }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

GetSchedule.propTypes = {
  children: PropTypes.func.isRequired,
  affiliateUuid: PropTypes.string.isRequired,
};

export default GetSchedule;
