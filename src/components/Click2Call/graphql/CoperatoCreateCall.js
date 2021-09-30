import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation Click2Call_CoperatoCreateCall(
    $uuid: String!
    $field: String!
    $type: String!
    $prefix: String!
  ) {
    clickToCall {
      coperato {
        createCall(
          uuid: $uuid
          field: $field
          type: $type
          prefix: $prefix
        )
      }
    }
  }`;

const CoperatoCreateCall = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CoperatoCreateCall.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CoperatoCreateCall;