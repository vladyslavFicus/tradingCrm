import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Notes from '../components/Notes';
import { notesQuery } from '.././../../../../../../graphql/queries/notes';
import { actionCreators as noteTypesActionCreators } from '../modules/noteTypes';

const mapStateToProps = ({
  userNotes: { noteTypes },
  i18n: { locale },
}) => ({
  noteTypes,
  locale,
});

export default compose(
  connect(mapStateToProps, noteTypesActionCreators),
  graphql(notesQuery, {
    options: ({ match: { params: { id: playerUUID } }, location: { query } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        playerUUID,
        ...query ? query.filters : {},
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
)(Notes);
