import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withModals } from 'hoc';
import CallbackDetailsModal from '../CallbackDetailsModal';
import CallbacksList from './CallbacksList';

export default compose(
  withRouter,
  withModals({
    callbackDetails: CallbackDetailsModal,
  }),
)(CallbacksList);
