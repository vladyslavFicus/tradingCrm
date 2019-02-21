import React, { PureComponent, Fragment } from 'react';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import { InputField, NasSelectField, DateTimeField } from 'components/ReduxForm';
import { attributeLabels, genders, AGE_YEARS_CONSTRAINT } from '../constants';

class PersonalForm extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  ageValidator = (current) => {
    const requireAge = moment().subtract(AGE_YEARS_CONSTRAINT, 'year');

    return current.isBefore(requireAge);
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
          <Field
            name="name"
            label={I18n.t(attributeLabels.name)}
            type="text"
            component={InputField}
            disabled={disabled}
            className="col-lg"
          />
          <Field
            name="surname"
            label={I18n.t(attributeLabels.surname)}
            type="text"
            component={InputField}
            disabled={disabled}
            className="col-lg"
          />
        </div>
        <div className="row">
          <Field
            name="birthDate"
            label={I18n.t(attributeLabels.birthDate)}
            component={DateTimeField}
            timeFormat={null}
            disabled={disabled}
            isValidDate={this.ageValidator}
            className="col-lg"
          />
          <Field
            name="gender"
            label={I18n.t(attributeLabels.gender)}
            type="text"
            component={NasSelectField}
            disabled={disabled}
            placeholder="UNDEFINED"
            className="col-lg"
            searchable={false}
          >
            {genders.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Field>
        </div>
      </Fragment>
    );
  }
}

export default PersonalForm;
