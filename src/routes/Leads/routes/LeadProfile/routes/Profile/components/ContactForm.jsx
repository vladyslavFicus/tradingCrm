import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import PropTypes from '../../../../../../../constants/propTypes';
import { InputField, NasSelectField } from '../../../../../../../components/ReduxForm';
import { attributeLabels } from '../constants';

const PhoneForm = ({
  disabled,
  phoneCodes,
}) => (
  <Fragment>
    <div className="row margin-bottom-20">
      <div className="col personal-form-heading">
        {I18n.t('LEAD_PROFILE.PERSONAL.CONTACTS_TITLE')}
      </div>
    </div>
    <div className="form-row">
      <Field
        name="phoneCode"
        component={NasSelectField}
        label={I18n.t(attributeLabels.phoneCode)}
        disabled={disabled}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        className="col-4"
      >
        {phoneCodes.map(code => (
          <option key={code} value={code}>
            {`+${code}`}
          </option>
        ))}
      </Field>
      <Field
        name="phone"
        type="text"
        component={InputField}
        label={I18n.t(attributeLabels.phone)}
        disabled={disabled}
        className="col-8"
      />
    </div>
    <div className="form-row">
      <Field
        name="mobileCode"
        component={NasSelectField}
        label={I18n.t(attributeLabels.mobileCode)}
        disabled={disabled}
        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
        className="col-4"
      >
        {phoneCodes.map(code => (
          <option key={code} value={code}>
            {`+${code}`}
          </option>
        ))}
      </Field>
      <Field
        name="mobile"
        type="text"
        component={InputField}
        label={I18n.t(attributeLabels.mobile)}
        disabled={disabled}
        className="col-8"
      />
    </div>
    <hr />
    <div className="form-row">
      <Field
        name="email"
        type="email"
        label={attributeLabels.email}
        component={InputField}
        className="col"
      />
    </div>
  </Fragment>
);

PhoneForm.propTypes = {
  phoneCodes: PropTypes.array,
  disabled: PropTypes.bool,
};

PhoneForm.defaultProps = {
  disabled: false,
  phoneCodes: [],
};

export default connect(({ options: { data: { phoneCodes } } }) => ({ phoneCodes }))(PhoneForm);
