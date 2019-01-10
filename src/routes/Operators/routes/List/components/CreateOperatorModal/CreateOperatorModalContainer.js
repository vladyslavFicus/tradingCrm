import { reduxForm } from 'redux-form';
import { withApollo, compose } from 'react-apollo';
import { createValidator, translateLabels } from '../../../../../../utils/validator';
import { withReduxFormValues } from '../../../../../../components/HighOrder';
import CreateOperatorModal from './CreateOperatorModal';
import { attributeLabels } from './constants';

export default compose(
  withApollo,
  reduxForm({
    form: 'operatorCreateForm',
    validate: createValidator({
      firstName: ['required', 'string', 'min:3'],
      lastName: ['required', 'string', 'min:3'],
      email: ['required', 'email'],
      phone: 'min:3',
      department: 'required',
      role: 'required',
    }, translateLabels(attributeLabels), false),
  }),
  withReduxFormValues,
)(CreateOperatorModal);
