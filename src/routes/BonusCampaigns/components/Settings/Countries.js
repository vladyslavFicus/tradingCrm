import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { get } from 'lodash';
import countryList from '../../../../utils/countryList';
import { NasSelectField } from '../../../../components/ReduxForm';
import { targetTypes } from '../../../../constants/bonus-campaigns';

class Countries extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  render() {
    const { _reduxForm: { values: formValues } } = this.context;
    const targetType = get(formValues, 'targetType');

    if (targetType !== targetTypes.ALL) {
      return null;
    }

    const { disabled } = this.props;
    const countries = get(formValues, 'countries', []);
    const excludeCountries = get(formValues, 'excludeCountries');

    const label = excludeCountries
      ? I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDED_COUNTRIES')
      : I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.COUNTRIES');

    if (disabled) {
      return (
        <div className="form-group">
          <label>{label}</label>
          <div className="select-disabled-container">
            {
              countries.length
                ? countries.map(countryCode => countryList[countryCode]).join(', ')
                : I18n.t('COMMON.NONE')
            }
          </div>
        </div>
      );
    }

    return (
      <Field
        name="countries"
        label={
          <span>
            {label}
            <span className="label-action">
              <Field
                name="excludeCountries"
                type="checkbox"
                component="input"
              />
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDE')}
            </span>
          </span>
        }
        component={NasSelectField}
        position="vertical"
        multiple
      >
        {Object
          .keys(countryList)
          .map(key => <option key={key} value={key}>{countryList[key]}</option>)
        }
      </Field>
    );
  }
}

export default Countries;
