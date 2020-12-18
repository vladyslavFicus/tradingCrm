import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { FormikSwitchField } from 'components/Formik';

const RegulatedForm = ({ initialValues, handleChange }) => (
  <Formik
    enableReinitialize
    initialValues={initialValues}
    onSubmit={handleChange}
  >
    {({ submitForm }) => (
      <Form>
        <Field
          name="fatca"
          label={I18n.t('CLIENT_PROFILE.FATCA.TITLE')}
          component={FormikSwitchField}
          onChange={submitForm}
        />
        <Field
          name="crs"
          label={I18n.t('CLIENT_PROFILE.CRS.TITLE')}
          component={FormikSwitchField}
          onChange={submitForm}
        />
      </Form>
    )}
  </Formik>
);

RegulatedForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RegulatedForm;
