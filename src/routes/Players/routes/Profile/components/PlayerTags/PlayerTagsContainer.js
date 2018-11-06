import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PlayerTags from './PlayerTags';
import { playerTagsQuery } from '../../../../../../graphql/queries/tags';
import { createOrLinkTagMutation, unlinkTagMutation } from '../../../../../../graphql/mutations/tag';

export default compose(
  withRouter,
  graphql(playerTagsQuery, {
    name: 'playerTags',
    options: ({ match: { params: { id: playerUUID } } }) => ({
      variables: {
        playerUUID,
        pinned: true,
      },
    }),
  }),
  graphql(createOrLinkTagMutation, {
    name: 'createOrLinkTag',
  }),
  graphql(unlinkTagMutation, {
    name: 'unlinkTag',
  }),
)(PlayerTags);
