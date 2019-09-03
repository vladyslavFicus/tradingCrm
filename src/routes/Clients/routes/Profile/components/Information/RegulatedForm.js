import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SwitchField } from 'components/ReduxForm';

const FORM_NAME = 'regulatedForm';

const RegulatedForm = () => (
  <form>
    <Field
      name="fatca.provided"
      label={I18n.t('CLIENT_PROFILE.FATCA.TITLE')}
      component={SwitchField}
    />
    <Field
      name="crs"
      label={I18n.t('CLIENT_PROFILE.CRS.TITLE')}
      component={SwitchField}
    />
  </form>
);

const RegualtedReduxForm = reduxForm({
  form: FORM_NAME,
  onChange: (values, dispatch, props) => {
    props.handleChange(values);
  },
  enableReinitialize: true,
})(RegulatedForm);

export default RegualtedReduxForm;
