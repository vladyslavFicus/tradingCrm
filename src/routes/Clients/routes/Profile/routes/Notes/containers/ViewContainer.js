import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Notes from '../components/Notes';
import { notesQuery } from '.././../../../../../../graphql/queries/notes';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
  connect(mapStateToProps),
  graphql(notesQuery, {
    options: ({ match: { params: { id: playerUUID } }, location: { query } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        playerUUID,
        size: 10,
        page: 0,
        ...query ? query.filters : {},
      },
    }),
    props: ({
      notes: {
        notes, fetchMore, ...rest
      },
    }) => ({
      notes: {
        ...rest,
        notes,
        loadMoreNotes: () => fetchMore({
          variables: { page: notes.number + 1 },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return {
              ...previousResult,
              ...fetchMoreResult,
              notes: {
                ...previousResult.notes,
                ...fetchMoreResult.notes,
                page: fetchMoreResult.notes.page,
                content: [
                  ...previousResult.notes.content,
                  ...fetchMoreResult.notes.content,
                ],
              },
            };
          },
        }),
      },
    }),
    name: 'notes',
  })
)(Notes);
