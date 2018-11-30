import { compose, graphql } from 'react-apollo';
import { withNotifications } from '../HighOrder';
import { operatorsQuery } from '../../graphql/queries/operators';
import { updateCallbackMutation } from '../../graphql/mutations/callbacks';
import CallbackDetailsModal from './CallbackDetailsModal';

export default compose(
  withNotifications,
  graphql(updateCallbackMutation, { name: 'updateCallback' }),
  graphql(operatorsQuery, {
    name: 'operators',
    options: () => ({
      variables: {
        size: 2000,
      },
    }),
  }),
)(CallbackDetailsModal);
