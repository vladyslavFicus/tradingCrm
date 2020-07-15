import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation PartnerHeader_changePartnerPasswordMutation(
    $uuid: String!
    $newPassword: String!
  ) {
    auth {
      changeOperatorPassword(
        operatorUuid: $uuid
        newPassword: $newPassword
      )
    }
  }
`;

const changePartnerPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

changePartnerPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default changePartnerPasswordMutation;
