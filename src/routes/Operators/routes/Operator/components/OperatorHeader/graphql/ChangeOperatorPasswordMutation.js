import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation OperatorHeader_ChangeOperatorPasswordMutation(
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

const ChangeOperatorPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ChangeOperatorPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ChangeOperatorPasswordMutation;
