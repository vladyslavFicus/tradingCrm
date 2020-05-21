import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query getSchedule($affiliateUuid: String!) {
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

const getSchedule = ({ children, affiliateUuid }) => (
  <Query
    query={REQUEST}
    variables={{ affiliateUuid }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

getSchedule.propTypes = {
  children: PropTypes.func.isRequired,
  affiliateUuid: PropTypes.string.isRequired,
};

export default getSchedule;
