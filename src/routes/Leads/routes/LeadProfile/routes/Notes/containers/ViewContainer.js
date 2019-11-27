import { graphql, compose } from 'react-apollo';
import { createQueryPagination } from '@newage/backoffice_utils';
import Notes from '../components/Notes';
import { notesQuery } from '../../../../../../../graphql/queries/notes';

export default compose(
  graphql(notesQuery, {
    options: ({ match: { params: { id } }, location: { query } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        targetUUID: id,
        size: 25,
        page: 0,
        ...query ? query.filters : {},
      },
    }),
    props: ({ notes: { notes, fetchMore, ...rest } }) => ({
      notes: {
        ...rest,
        notes,
        loadMoreNotes: () => {
          const data = notes && notes.data ? notes.data : {};
          createQueryPagination(fetchMore, { page: data.number + 1, size: 25 }, 'notes.data');
        },
      },
    }),
    name: 'notes',
  }),
)(Notes);
