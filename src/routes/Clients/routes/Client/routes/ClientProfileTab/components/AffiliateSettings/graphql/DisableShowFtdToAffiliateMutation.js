import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation AffiliateSettings__DisableShowFtdToAffiliateMutation(
    $showFtdToAffiliate: Boolean!
    $profileUuid: String!
  ) {
    payment {
      disableShowFtdToAffiliate(
        showFtdToAffiliate: $showFtdToAffiliate
        profileUuid: $profileUuid
      )
    }
  }
`;

const DisableShowFtdToAffiliateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DisableShowFtdToAffiliateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DisableShowFtdToAffiliateMutation;
