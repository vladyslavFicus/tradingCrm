import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose, graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withNotifications } from 'components/HighOrder';
import { addOperatorToBranch } from 'graphql/mutations/hierarchy';
import AddBranchForm from './AddBranchForm';

const FORM_NAME = 'HierarchyOperatorProfileAddBranchForm';

const mapStateToProps = ({ auth: { uuid } }) => ({ operatorId: uuid });

export default compose(
  connect(mapStateToProps),
  withApollo,
  withRouter,
  withNotifications,
  reduxForm({
    form: FORM_NAME,
  }),
  graphql(addOperatorToBranch, {
    name: 'addOperatorToBranch',
  }),
)(AddBranchForm);
