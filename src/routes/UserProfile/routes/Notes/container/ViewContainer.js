import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import View from '../components/View';
import { notesQuery } from '.././../../../../graphql/queries/notes';

const mapStateToProps = ({
  userNotes: { noteTypes },
  i18n: { locale },
}) => ({
  noteTypes,
  locale,
});

export default compose(
  connect(mapStateToProps),
  graphql(notesQuery, {
    options: ({ params: { id: playerUUID } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        playerUUID,
        size: 10,
        page: 0,
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
)(View);
