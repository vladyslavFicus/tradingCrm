import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { notesQuery } from 'graphql/queries/notes';
import { PINNED_NOTES_SIZE } from '../constants';

const REQUEST = notesQuery;

const GetLeadProfile = ({
  match: {
    params: { id },
  },
  children,
}) => (
  <Query
    query={REQUEST}
    variables={{
      size: PINNED_NOTES_SIZE,
      targetUUID: id,
      pinned: true,
    }}
  >
    {children}
  </Query>
);

GetLeadProfile.propTypes = {
  children: PropTypes.func.isRequired,
  ...PropTypes.router,
};

export default GetLeadProfile;
