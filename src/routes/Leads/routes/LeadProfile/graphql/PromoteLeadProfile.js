import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`mutation promoteLead(
  $args: CreateProfileInputType
) {
  leads {
    promote (
      args: $args
    ) {
      data {
        uuid
      }
      error {
        error
        fields_errors
      }
    }
  }
}`;

const RemoveLeadProfileNote = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

RemoveLeadProfileNote.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RemoveLeadProfileNote;
