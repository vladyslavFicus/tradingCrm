import { compose } from 'react-apollo';
import { withModals } from 'hoc';
import { callbacksQuery } from '../../graphql/queries/callbacks';
import { graphql } from '../../graphql/utils';
import CallbackDetailsModal from '../CallbackDetailsModal';
import Calendar from '../Calendar';
import CallbacksCalendar from './CallbacksCalendar';

export default compose(
  withModals({
    callbackDetails: CallbackDetailsModal,
  }),
  graphql(callbacksQuery, {
    name: 'callbacks',
    options: () => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        callbackTimeFrom: Calendar.firstVisibleDate(),
        callbackTimeTo: Calendar.lastVisibleDate(),
        limit: 2000,
      },
    }),
  }),
)(CallbacksCalendar);
