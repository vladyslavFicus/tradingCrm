import React, { Fragment } from 'react';
import { Field } from 'formik';
import I18n from 'i18n-js';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { attributeLabels } from '../constants';

const AddressForm = ({ disabled }) => (
  <Fragment>
    <div className="row margin-bottom-20">
      <div className="col personal-form-heading">
        {I18n.t('LEAD_PROFILE.PERSONAL.ADDRESS_TITLE')}
      </div>
    </div>
    <div className="row">
      <Field
        name="country"
        label={I18n.t(attributeLabels.country)}
        type="text"
        placeholder="UNDEFINED"
        className="col-lg-6"
        component={FormikSelectField}
        disabled={disabled}
      >
        {Object.entries(countryList).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Field>
      <Field
        name="city"
        label={I18n.t(attributeLabels.city)}
        type="text"
        component={FormikInputField}
        disabled={disabled}
        className="col-lg-6"
      />
    </div>
  </Fragment>
);

AddressForm.propTypes = {
  disabled: PropTypes.bool,
};

AddressForm.defaultProps = {
  disabled: false,
};

export default AddressForm;
