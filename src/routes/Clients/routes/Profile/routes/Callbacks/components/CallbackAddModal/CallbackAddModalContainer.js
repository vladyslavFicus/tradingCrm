import { compose, graphql } from 'react-apollo';
import { withNotifications } from '../../../../../../../../components/HighOrder';
import { operatorsQuery } from '../../../../../../../../graphql/queries/operators';
import { createCallbackMutation } from '../../../../../../../../graphql/mutations/callbacks';
import CallbackAddModal from './CallbackAddModal';

export default compose(
  withNotifications,
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
    options: () => ({
      variables: {
        size: 2000,
      },
    }),
  }),
)(CallbackAddModal);
