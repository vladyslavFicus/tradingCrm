import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { get } from 'lodash';
import countryList from '../../../../utils/countryList';
import { NasSelectField, CheckBox } from '../../../../components/ReduxForm';
import { targetTypes } from '../../../../constants/bonus-campaigns';

class Countries extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    formValues: PropTypes.shape({
      countries: PropTypes.arrayOf(PropTypes.string),
      excludeCountries: PropTypes.bool,
    }),
    className: PropTypes.string,
  };
  static defaultProps = {
    formValues: {},
    className: '',
  };

  render() {
    const {
      formValues,
      disabled,
      className,
    } = this.props;
    const targetType = get(formValues, 'targetType');

    if (targetType !== targetTypes.ALL) {
      return null;
    }

    const countries = get(formValues, 'countries', []);
    const excludeCountries = get(formValues, 'excludeCountries');

    const label = excludeCountries
      ? I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDED_COUNTRIES')
      : I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.COUNTRIES');

    if (disabled) {
      return (
        <div className={className}>
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
        </div>
      );
    }

    return (
      <Field
        name="countries"
        label={label}
        labelAddon={
          <Field
            id="countries-exclude-checkbox"
            name="excludeCountries"
            component={CheckBox}
            type="checkbox"
            label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDE')}
          />
        }
        component={NasSelectField}
        position="vertical"
        multiple
        className={className}
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
