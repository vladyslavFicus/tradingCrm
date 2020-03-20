import { reduxForm } from 'redux-form';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withNotifications } from 'hoc';
import { addOperatorToBranch } from 'graphql/mutations/hierarchy';
import AddBranchForm from './AddBranchForm';

const FORM_NAME = 'HierarchyPartnerProfileAddBranchForm';

export default compose(
  withRouter,
  withNotifications,
  reduxForm({
    form: FORM_NAME,
  }),
  graphql(addOperatorToBranch, {
    name: 'addOperatorToBranch',
  }),
)(AddBranchForm);
