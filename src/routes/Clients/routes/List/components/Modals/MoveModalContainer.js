import { graphql, compose } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { withNotifications } from 'components/HighOrder';
import { clientsBulkRepresentativeUpdate } from 'graphql/mutations/profile';
import { createValidator } from 'utils/validator';
import MoveModal from './MoveModal';

const FORM_NAME = 'moveModalForm';

export default compose(
  withNotifications,
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: values => createValidator({ aquisitionStatus: ['string', 'required'] }, {}, false)(values),
  }),
  graphql(clientsBulkRepresentativeUpdate, {
    name: 'bulkRepresentativeUpdate',
  }),
)(MoveModal);
