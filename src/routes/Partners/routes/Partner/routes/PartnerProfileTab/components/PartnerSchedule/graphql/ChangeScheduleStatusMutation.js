import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation Partner_ChangeScheduleStatusMutation(
  $affiliateUuid: String!
  $data: [PartnerScheduleStatus__Input]
) {
  partner {
    changeScheduleStatus (
      affiliateUuid: $affiliateUuid
      data: $data
    )
  }
}
`;

const ChangeScheduleStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeScheduleStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeScheduleStatusMutation;
