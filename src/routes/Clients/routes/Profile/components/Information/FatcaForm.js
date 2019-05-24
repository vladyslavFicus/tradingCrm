import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SwitchField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';

const FORM_NAME = 'fatcaForm';

const FatcaForm = () => (
  <form>
    <Field
      name="provided"
      label={I18n.t('CLIENT_PROFILE.FATCA.TITLE')}
      component={SwitchField}
    />
  </form>
);

const FatcaReduxForm = reduxForm({
  form: FORM_NAME,
  onChange: (values, dispatch, props) => {
    props.handleChange(values);
  },
  enableReinitialize: true,
  validate: createValidator({
    provided: ['required', 'boolean'],
  }),
})(FatcaForm);

export default FatcaReduxForm;
