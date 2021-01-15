import React, { PureComponent, Fragment } from 'react';
import { Field } from 'formik';
import I18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import {
  FormikInputField,
  FormikSelectField,
  FormikDatePickerNew,
} from 'components/Formik';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from '../constants';

class PersonalForm extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const { disabled } = this.props;

    return (
      <Fragment>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('LEAD_PROFILE.PERSONAL.INFO_TITLE')}
          </div>
        </div>
        <div className="row">
          <div className="col-lg">
            <Field
              name="name"
              label={I18n.t(attributeLabels.name)}
              type="text"
              component={FormikInputField}
              disabled={disabled}
            />
          </div>
          <div className="col-lg">
            <Field
              name="surname"
              label={I18n.t(attributeLabels.surname)}
              type="text"
              component={FormikInputField}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg">
            <Field
              name="birthDate"
              label={I18n.t(attributeLabels.birthDate)}
              component={FormikDatePickerNew}
              maxDate={moment().subtract(AGE_YEARS_CONSTRAINT, 'year')}
              disabled={disabled}
            />
          </div>

          <div className="col-lg">
            <Field
              name="gender"
              label={I18n.t(attributeLabels.gender)}
              component={FormikSelectField}
              disabled={disabled}
              placeholder="UNDEFINED"
            >
              {genders.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PersonalForm;
