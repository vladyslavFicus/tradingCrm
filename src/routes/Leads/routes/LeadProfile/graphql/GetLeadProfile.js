import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { leadProfileQuery } from 'graphql/queries/leads';

const REQUEST = leadProfileQuery;

const GetLeadProfile = ({
  match: {
    params: { id: leadId },
  },
  children,
}) => (
  <Query query={REQUEST} variables={{ leadId }} fetchPolicy="network-only">
    {children}
  </Query>
);

GetLeadProfile.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default GetLeadProfile;
