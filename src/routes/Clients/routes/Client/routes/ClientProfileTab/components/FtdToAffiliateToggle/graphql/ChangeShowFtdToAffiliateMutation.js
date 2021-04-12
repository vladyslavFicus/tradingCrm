import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation FtdToAffiliateToggle__ShowFtdToAffiliateMutation(
    $showFtdToAffiliate: Boolean!
    $profileUuid: String
  ) {
    payment {
      changeShowFtdToAffiliate(
        showFtdToAffiliate: $showFtdToAffiliate
        profileUuid: $profileUuid
      )
    }
  }
`;

const ChangeShowFtdToAffiliateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeShowFtdToAffiliateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeShowFtdToAffiliateMutation;
