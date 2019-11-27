import { reduxForm } from 'redux-form';
import { compose } from 'react-apollo';
import { createValidator, translateLabels } from 'utils/validator';
import { withReduxFormValues } from 'components/HighOrder';
import { getActiveBrandConfig } from 'config';
import CreatePartnerModal from './CreatePartnerModal';
import { attributeLabels } from './constants';

export default compose(
  reduxForm({
    form: 'partnerCreateForm',
    validate: createValidator({
      firstName: ['required', 'string', 'min:3'],
      lastName: ['required', 'string', 'min:3'],
      email: ['required', 'email'],
      password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
      phone: ['required', 'min:3'],
    }, translateLabels(attributeLabels), false),
  }),
  withReduxFormValues,
)(CreatePartnerModal);
