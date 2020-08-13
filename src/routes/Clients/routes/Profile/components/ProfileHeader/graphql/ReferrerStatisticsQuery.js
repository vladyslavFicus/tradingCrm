import React from 'react';
import PropTypes from 'constants/propTypes';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query ReferrerStatistics(
    $uuid: String!
  ) {
    referrerStatistics(uuid: $uuid) {
      referralsCount
      ftdCount
      remunerationTotalAmount
    }
  }`;

const ReferrerStatistics = ({ children, profile: { uuid } }) => (
  <Query query={REQUEST} variables={{ uuid }}>
    {children}
  </Query>
);

ReferrerStatistics.propTypes = {
  children: PropTypes.func.isRequired,
  profile: PropTypes.profile.isRequired,
};

export default ReferrerStatistics;
