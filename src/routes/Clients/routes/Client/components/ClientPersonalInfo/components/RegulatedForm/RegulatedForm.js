import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { FormikSwitchField } from 'components/Formik';

class RegulatedForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
  };

  render() {
    const {
      initialValues,
      handleChange,
    } = this.props;

    return (
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
  }
}

export default RegulatedForm;
