import React, { Fragment } from 'react';
import { Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { FormikInputField } from 'components/Formik';
import { attributeLabels } from '../constants';

const PhoneForm = ({
  disabled,
}) => (
  <Fragment>
    <div className="row margin-bottom-20">
      <div className="col personal-form-heading">
        {I18n.t('LEAD_PROFILE.PERSONAL.CONTACTS_TITLE')}
      </div>
    </div>
    <div className="row">
      <Field
        name="phone"
        type="text"
        component={FormikInputField}
        label={I18n.t(attributeLabels.phone)}
        disabled={disabled}
        className="col-4"
      />
    </div>
    <div className="row">
      <Field
        name="mobile"
        type="text"
        component={FormikInputField}
        label={I18n.t(attributeLabels.mobile)}
        disabled={disabled}
        className="col-4"
      />
    </div>
    <div className="row">
      <Field
        name="email"
        type="email"
        label={I18n.t(attributeLabels.email)}
        component={FormikInputField}
        className="col-4"
      />
    </div>
  </Fragment>
);

PhoneForm.propTypes = {
  disabled: PropTypes.bool,
};

PhoneForm.defaultProps = {
  disabled: false,
};

export default PhoneForm;
