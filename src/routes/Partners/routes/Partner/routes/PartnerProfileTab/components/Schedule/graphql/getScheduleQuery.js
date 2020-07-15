import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query Schedule_ScheduleQuery(
    $uuid: String!
  ) {
    partner(uuid: $uuid) {
      _id
      schedule {
        activated
        countrySpreads {
          country
          limit
        },
        day
        totalLimit
        workingHoursFrom
        workingHoursTo
      }  
    }
}
`;

const GetSchedule = ({ children, affiliateUuid }) => (
  <Query
    query={REQUEST}
    variables={{ uuid: affiliateUuid }}
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
