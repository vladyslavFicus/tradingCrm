import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation changeScheduleStatus(
  $affiliateUuid: String!
  $data: [ScheduleStatus__Input]
) {
  schedule {
    changeScheduleStatus (
      affiliateUuid: $affiliateUuid
      data: $data
    )
  }
}
`;

const changeScheduleStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

changeScheduleStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default changeScheduleStatusMutation;
