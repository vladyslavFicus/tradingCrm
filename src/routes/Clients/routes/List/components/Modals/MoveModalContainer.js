
import { graphql, compose } from 'react-apollo';
import { withNotifications } from 'hoc';
import { clientsBulkRepresentativeUpdate } from 'graphql/mutations/profile';
import MoveModal from './MoveModal';

export default compose(
  withNotifications,
  graphql(clientsBulkRepresentativeUpdate, {
    name: 'bulkRepresentativeUpdate',
  }),
)(MoveModal);
