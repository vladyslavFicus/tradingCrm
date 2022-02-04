import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation SendSmsMutation(
    $uuid: String!
    $field: String!
    $type: String!
    $from: String!
    $message: String!
  ) {
    sms {
      coperato {
        sendSms(
          uuid: $uuid
          field: $field
          type: $type
          from: $from
          message: $message
        )
      }
    }
  }
`;

const SendSmsMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

SendSmsMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SendSmsMutation;
