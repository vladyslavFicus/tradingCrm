import { compose, graphql } from 'react-apollo';
import { withNotifications } from 'hoc';
import { addNoteMutation } from 'graphql/mutations/note';
import { operatorsQuery } from 'graphql/queries/operators';
import { createCallbackMutation } from 'graphql/mutations/callbacks';
import CallbackAddModal from './CallbackAddModal';

export default compose(
  withNotifications,
  graphql(addNoteMutation, {
    name: 'addNote',
  }),
  graphql(createCallbackMutation, {
    name: 'createCallback',
    options: ({ userId }) => ({
      variables: {
        userId,
      },
    }),
  }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
)(CallbackAddModal);
