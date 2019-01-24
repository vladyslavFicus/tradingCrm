import { reduxForm } from 'redux-form';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { updateUser } from 'graphql/mutations/hierarchy';
import { withNotifications } from 'components/HighOrder';
import HierarchyProfileForm from './HierarchyProfileForm';

const FORM_NAME = 'HierarchyOperatorProfileForm';

export default compose(
  withRouter,
  withNotifications,
  graphql(updateUser, {
    name: 'updateOperatorHierarchy',
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
  }),
)(HierarchyProfileForm);
