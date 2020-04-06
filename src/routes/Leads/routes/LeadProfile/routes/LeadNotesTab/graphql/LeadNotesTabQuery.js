import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import { notesQuery as REQUEST } from 'graphql/queries/notes';

const LeadNotesTabQuery = ({
  match: {
    params: { id },
  },
  location: { query },
  children,
}) => (
  <Query
    query={REQUEST}
    variables={{
      targetUUID: id,
      size: 20,
      page: 0,
      ...(query ? query.filters : {}),
    }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

LeadNotesTabQuery.propTypes = {
  ...PropTypes.router,
  children: PropTypes.func.isRequired,
};

export default LeadNotesTabQuery;
