import { compose } from 'react-apollo';
import { callbacksQuery } from '../../graphql/queries/callbacks';
import { graphql } from '../../graphql/utils';
import { withModals } from '../HighOrder';
import CallbackDetailsModal from '../CallbackDetailsModal';
import Calendar from '../Calendar';
import CallbacksCalendar from './CallbacksCalendar';


export default compose(
  withModals({
    callbackDetails: CallbackDetailsModal,
  }),
  graphql(callbacksQuery, {
    name: 'callbacks',
    options: ({ operatorId }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        operatorId,
        callbackTimeFrom: Calendar.firstVisibleDate(),
        callbackTimeTo: Calendar.lastVisibleDate(),
        limit: 2000,
      },
    }),
  }),
)(CallbacksCalendar);
