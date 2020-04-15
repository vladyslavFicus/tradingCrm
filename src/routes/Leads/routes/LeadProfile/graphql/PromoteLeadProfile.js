import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { promoteLeadToClient } from 'graphql/mutations/leads';

const REQUEST = promoteLeadToClient;

const RemoveLeadProfileNote = ({ children }) => (
  <Mutation mutation={REQUEST}>{children}</Mutation>
);

RemoveLeadProfileNote.propTypes = {
  children: PropTypes.func.isRequired,
};

export default RemoveLeadProfileNote;
