import { reduxForm } from 'redux-form';
import { get } from 'lodash';
import { withApollo, graphql, compose } from 'react-apollo';
import { createValidator, translateLabels } from '../../utils/validator';
import { operatorsQuery } from '../../graphql/queries/operators';
import { addOperatorToBranch } from '../../graphql/mutations/hierarchy';
import { withNotifications } from '../HighOrder';
import AddOperatorToBranchModal from './AddOperatorToBranchModal';
import { attributeLabels } from './formFields';

const FORM_NAME = 'addOperatorToBranchModalForm';

export default compose(
  withApollo,
  withNotifications,
  graphql(addOperatorToBranch, {
    name: 'addOperatorToBranch',
  }),
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate: (values, { operators: { operators } }) => {
      const hierarchyOperators = get(operators, 'data.content') || [];

      return createValidator({
        operatorId: [`in:,${hierarchyOperators.map(({ uuid }) => uuid).join()}`],
      }, translateLabels(attributeLabels), false)(values);
    },
  }),
)(AddOperatorToBranchModal);
