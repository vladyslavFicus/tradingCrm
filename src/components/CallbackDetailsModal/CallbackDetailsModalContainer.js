import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { withNotifications } from '../HighOrder';
import { operatorsQuery } from '../../graphql/queries/operators';
import { callbackQuery } from '../../graphql/queries/callbacks';
import { updateCallbackMutation } from '../../graphql/mutations/callbacks';
import CallbackDetailsModal from './CallbackDetailsModal';

export default compose(
  withNotifications,
  graphql(callbackQuery, {
    name: 'callback',
    options: ({ callbackId }) => ({
      variables: {
        id: callbackId,
      },
    }),
    props: ({ callback, ownProps }) => ({
      ...ownProps,
      ...(get(callback, 'callback.data') && { initialValues: callback.callback.data }),
      callback,
    }),
  }),
  graphql(updateCallbackMutation, { name: 'updateCallback' }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
)(CallbackDetailsModal);
