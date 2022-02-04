import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation OperatorHeader_ResetOperatorPasswordMutation(
    $uuid: String!
  ) {
    auth {
      resetUserPassword(userUuid: $uuid)
    }
  }
`;

const ResetOperatorPasswordMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

ResetOperatorPasswordMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ResetOperatorPasswordMutation;
