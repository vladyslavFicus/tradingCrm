import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation Partner_CreateScheduleMutation(
  $affiliateUuid: String!,
  $activated: Boolean,
  $totalLimit: Int,
  $day: String,
  $workingHoursFrom: String,
  $workingHoursTo: String,
  $countrySpreads: [PartnerSchedule__Input],
) {
  partner {
    createSchedule (
      affiliateUuid: $affiliateUuid,
      activated: $activated,
      totalLimit: $totalLimit,
      day: $day,
      workingHoursFrom: $workingHoursFrom,
      workingHoursTo: $workingHoursTo,
      countrySpreads: $countrySpreads,
    )
  }
}
`;

const createSchudelMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

createSchudelMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default createSchudelMutation;