import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import View from '../components/View';
import { notesQuery } from '.././../../../../graphql/queries/notes';

const mapStateToProps = ({ userNotes: { view, noteTypes }, i18n: { locale } }) => ({
  view,
  noteTypes,
  locale,
});

export default compose(
  connect(mapStateToProps),
  graphql(notesQuery, {
    options: ({ params: { id: playerUUID } }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'notes',
  })
)(View);
